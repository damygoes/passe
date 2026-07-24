import { apiError, apiSuccess, requireAuth } from '@/lib/api/api'
import { deleteCloudinaryAssets } from '@/lib/media/cloudinary'
import { generateMediaPlaceholder } from '@/lib/media/media-placeholder'
import { MediaOwnershipError, normalizeMediaRef, resolveTripMedia } from '@/lib/media/media'
import { deleteS3Objects } from '@/lib/media/s3'
import { db, memories, memoryMedia, trips } from '@passe/db'
import { createLogger } from '@passe/logger'
import { TripSchema, UpdateTripSchema } from '@passe/types/trip'
import { and, eq } from 'drizzle-orm'

const log = createLogger({ context: { module: 'api/trips/id' } })

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

// GET /api/trips/[id]
export async function GET(_req: Request, ctx: RouteContext<'/api/trips/[id]'>) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { id } = await ctx.params

  const trip = await db.query.trips.findFirst({
    where: and(eq(trips.id, id), eq(trips.userId, userId)),
  })

  if (!trip) return apiError('Trip not found', 404)

  const parsed = TripSchema.safeParse(resolveTripMedia(trip))
  if (!parsed.success) {
    log.error('DB output failed schema validation', { tripId: id, issues: parsed.error.issues })
    return apiError('Invalid trip data', 500)
  }

  return apiSuccess(parsed.data)
}

// PATCH /api/trips/[id]
export async function PATCH(req: Request, ctx: RouteContext<'/api/trips/[id]'>) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { id } = await ctx.params
  const body = await req.json()
  const parsed = UpdateTripSchema.safeParse(body)

  if (!parsed.success) {
    return apiError(JSON.stringify(parsed.error.flatten().fieldErrors), 400)
  }

  let coverImageUrl: string | null | undefined
  try {
    coverImageUrl =
      'coverImageUrl' in parsed.data
        ? normalizeMediaRef(parsed.data.coverImageUrl, userId)
        : undefined
  } catch (err) {
    if (err instanceof MediaOwnershipError) return apiError(err.message, 400)
    throw err
  }

  // Capture the outgoing cover image before it's overwritten so the old S3
  // object can be cleaned up after a successful write — only needed when
  // this request actually touches coverImageUrl. Also fetch the existing
  // placeholder so an unchanged cover image can carry it forward instead of
  // paying for a redundant S3 fetch + sharp resize.
  let previousCoverImageUrl: string | null | undefined
  let previousCoverImagePlaceholder: string | null | undefined
  if ('coverImageUrl' in parsed.data) {
    const existing = await db.query.trips.findFirst({
      where: and(eq(trips.id, id), eq(trips.userId, userId)),
      columns: { coverImageUrl: true, coverImagePlaceholder: true },
    })
    previousCoverImageUrl = existing?.coverImageUrl
    previousCoverImagePlaceholder = existing?.coverImagePlaceholder
  }

  let coverImagePlaceholder: string | null | undefined
  if (coverImageUrl !== undefined) {
    if (coverImageUrl === previousCoverImageUrl) {
      coverImagePlaceholder = previousCoverImagePlaceholder ?? null
    } else if (coverImageUrl === null) {
      coverImagePlaceholder = null
    } else {
      coverImagePlaceholder = await generateMediaPlaceholder(coverImageUrl)
    }
  }

  let updated
  try {
    ;[updated] = await db
      .update(trips)
      .set({
        ...parsed.data,
        ...(coverImageUrl !== undefined ? { coverImageUrl, coverImagePlaceholder } : {}),
        updatedAt: new Date(),
      })
      .where(and(eq(trips.id, id), eq(trips.userId, userId)))
      .returning()
  } catch (err) {
    log.error('DB write failed', {
      tripId: id,
      error: err instanceof Error ? err.message : String(err),
    })
    return apiError('Internal server error', 500)
  }

  if (!updated) return apiError('Trip not found', 404)

  if (previousCoverImageUrl && previousCoverImageUrl !== coverImageUrl) {
    await cleanupMediaAssets([{ url: previousCoverImageUrl, mediaType: 'photo' }])
  }

  const validatedResponse = TripSchema.safeParse(resolveTripMedia(updated))
  if (!validatedResponse.success) {
    log.error('DB output failed schema validation', {
      tripId: id,
      issues: validatedResponse.error.issues,
    })
    return apiError('Invalid response data', 500)
  }

  return apiSuccess(validatedResponse.data)
}

// DELETE /api/trips/[id]
export async function DELETE(_req: Request, ctx: RouteContext<'/api/trips/[id]'>) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { id } = await ctx.params

  // Gather what will cascade away before deleting — the FK cascade removes
  // these rows from the DB, but the actual files still live on Cloudinary
  // and need an explicit cleanup call.
  const mediaRows = await db
    .select({ url: memoryMedia.url, mediaType: memoryMedia.mediaType })
    .from(memoryMedia)
    .innerJoin(memories, eq(memoryMedia.memoryId, memories.id))
    .where(eq(memories.tripId, id))

  let deleted
  try {
    ;[deleted] = await db
      .delete(trips)
      .where(and(eq(trips.id, id), eq(trips.userId, userId)))
      .returning()
  } catch (err) {
    log.error('DB write failed', {
      tripId: id,
      error: err instanceof Error ? err.message : String(err),
    })
    return apiError('Internal server error', 500)
  }

  if (!deleted) return apiError('Trip not found', 404)

  const allUrls = [
    ...mediaRows.map((row) => ({ url: row.url, mediaType: row.mediaType })),
    ...(deleted.coverImageUrl ? [{ url: deleted.coverImageUrl, mediaType: 'photo' as const }] : []),
  ]

  await cleanupMediaAssets(allUrls)

  return apiSuccess({ id: deleted.id })
}
