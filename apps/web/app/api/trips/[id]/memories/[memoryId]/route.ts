import { apiError, apiSuccess, requireAuth } from '@/lib/api'
import { deleteCloudinaryAssets } from '@/lib/cloudinary'
import { geocodeCityCountry } from '@/lib/geocode'
import { MediaOwnershipError, normalizeMediaRef } from '@/lib/media'
import { fromDbMemory, toDbMemoryValues } from '@/lib/memory'
import { deleteS3Objects } from '@/lib/s3'
import { db, memories, memoryMedia, users } from '@passe/db'
import { canMakeMemoryPublic } from '@passe/auth/plan-gates'
import { createLogger } from '@passe/logger'
import { MemorySchema, UpdateMemorySchema } from '@passe/types/memory'
import { and, asc, count, eq, ne } from 'drizzle-orm'

const log = createLogger({ context: { module: 'api/trips/id/memories/id' } })

// Distinguishes a legacy Cloudinary asset (a full https:// URL, left
// untouched by the migration) from a current S3-backed value (a bare
// object key) — used to route reads/deletes to the right provider.
function isLegacyCloudinaryUrl(value: string): boolean {
  return value.startsWith('http')
}

async function cleanupMediaAssets(
  assets: { url: string; mediaType: 'photo' | 'video' }[],
): Promise<void> {
  const legacy = assets.filter((asset) => isLegacyCloudinaryUrl(asset.url))
  const s3Keys = assets
    .filter((asset) => !isLegacyCloudinaryUrl(asset.url))
    .map((asset) => asset.url)
  await Promise.allSettled([
    deleteCloudinaryAssets(
      legacy.map((asset) => ({
        url: asset.url,
        resourceType: asset.mediaType === 'video' ? ('video' as const) : ('image' as const),
      })),
    ),
    deleteS3Objects(s3Keys),
  ])
}

// PATCH /api/trips/[id]/memories/[memoryId]
export async function PATCH(
  req: Request,
  ctx: RouteContext<'/api/trips/[id]/memories/[memoryId]'>,
) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { id: tripId, memoryId } = await ctx.params
  const body = await req.json()
  const parsed = UpdateMemorySchema.safeParse(body)

  if (!parsed.success) {
    return apiError(JSON.stringify(parsed.error.flatten().fieldErrors), 400)
  }

  if (parsed.data.isPublic === true) {
    const [user] = await db
      .select({ plan: users.plan })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
    if (!user) return apiError('User not found', 404)

    const countResult = await db
      .select({ publicCount: count() })
      .from(memories)
      .where(
        and(eq(memories.tripId, tripId), eq(memories.isPublic, true), ne(memories.id, memoryId)),
      )
    const publicCount = countResult[0]?.publicCount ?? 0

    if (!canMakeMemoryPublic(user.plan, publicCount)) {
      return apiError('Public memory limit reached for your plan', 403)
    }
  }

  // The client explicitly sends `location: null` when it has no GPS fix for
  // this save (see MemoryForm) — that's our signal to fall back to geocoding
  // the city/country. If `location` isn't a key at all, this update doesn't
  // touch location and toDbMemoryValues leaves any existing coordinates alone.
  const dataForDb =
    'location' in parsed.data && parsed.data.location == null
      ? {
          ...parsed.data,
          location: await geocodeCityCountry(parsed.data.city, parsed.data.country),
        }
      : parsed.data

  let updated
  try {
    ;[updated] = await db
      .update(memories)
      .set({ ...toDbMemoryValues(dataForDb), updatedAt: new Date() })
      .where(
        and(eq(memories.id, memoryId), eq(memories.tripId, tripId), eq(memories.userId, userId)),
      )
      .returning()
  } catch (err) {
    log.error('DB write failed', {
      memoryId,
      error: err instanceof Error ? err.message : String(err),
    })
    return apiError('Internal server error', 500)
  }

  if (!updated) return apiError('Memory not found', 404)

  // When the request includes media, replace the memory's media set wholesale
  // (delete + reinsert; array position = sortOrder).
  if (parsed.data.media !== undefined) {
    let normalizedMedia: typeof parsed.data.media
    try {
      normalizedMedia = parsed.data.media.map((item) => ({
        ...item,
        url: normalizeMediaRef(item.url, userId)!,
      }))
    } catch (err) {
      if (err instanceof MediaOwnershipError) return apiError(err.message, 400)
      throw err
    }

    const incomingUrls = new Set(normalizedMedia.map((item) => item.url))
    const existingMedia = await db.query.memoryMedia.findMany({
      where: eq(memoryMedia.memoryId, memoryId),
    })
    // Only photos dropped from the list get cleaned up — ones the client
    // re-sent unchanged must not be deleted from storage.
    const removedMedia = existingMedia.filter((media) => !incomingUrls.has(media.url))

    try {
      await db.delete(memoryMedia).where(eq(memoryMedia.memoryId, memoryId))
      if (normalizedMedia.length > 0) {
        await db.insert(memoryMedia).values(
          normalizedMedia.map((item, index) => ({
            memoryId,
            url: item.url,
            mediaType: item.mediaType,
            sortOrder: index,
            width: item.width ?? null,
            height: item.height ?? null,
          })),
        )
      }
    } catch (err) {
      log.error('DB write failed for memory media', {
        memoryId,
        error: err instanceof Error ? err.message : String(err),
      })
      return apiError('Internal server error', 500)
    }

    await cleanupMediaAssets(removedMedia)
  }

  const mediaRows = await db.query.memoryMedia.findMany({
    where: eq(memoryMedia.memoryId, memoryId),
    orderBy: asc(memoryMedia.sortOrder),
  })

  const validatedResponse = MemorySchema.safeParse(fromDbMemory({ ...updated, media: mediaRows }))
  if (!validatedResponse.success) {
    log.error('DB output failed schema validation', {
      memoryId,
      issues: validatedResponse.error.issues,
    })
    return apiError('Invalid response data', 500)
  }

  return apiSuccess(validatedResponse.data)
}

// DELETE /api/trips/[id]/memories/[memoryId]
export async function DELETE(
  _req: Request,
  ctx: RouteContext<'/api/trips/[id]/memories/[memoryId]'>,
) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { id: tripId, memoryId } = await ctx.params

  // The FK cascade removes these memory_media rows from the DB, but the
  // actual files still live on Cloudinary and need an explicit cleanup call.
  const mediaRows = await db.query.memoryMedia.findMany({
    where: eq(memoryMedia.memoryId, memoryId),
  })

  let deleted
  try {
    ;[deleted] = await db
      .delete(memories)
      .where(
        and(eq(memories.id, memoryId), eq(memories.tripId, tripId), eq(memories.userId, userId)),
      )
      .returning()
  } catch (err) {
    log.error('DB write failed', {
      memoryId,
      error: err instanceof Error ? err.message : String(err),
    })
    return apiError('Internal server error', 500)
  }

  if (!deleted) return apiError('Memory not found', 404)

  await cleanupMediaAssets(mediaRows)

  return apiSuccess({ id: deleted.id })
}
