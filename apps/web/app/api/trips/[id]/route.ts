import { apiError, apiSuccess, requireAuth } from '@/lib/api'
import { deleteCloudinaryAssets } from '@/lib/cloudinary'
import { MediaOwnershipError, normalizeMediaRef, resolveTripMedia } from '@/lib/media'
import { deleteS3Objects } from '@/lib/s3'
import { db, memories, memoryMedia, trips } from '@passe/db'
import { createLogger } from '@passe/logger'
import { TripSchema, UpdateTripSchema } from '@passe/types/trip'
import { and, eq } from 'drizzle-orm'

// Distinguishes a legacy Cloudinary asset (a full https:// URL, left
// untouched by the migration) from a current S3-backed value (a bare
// object key) — used to route reads/deletes to the right provider.
function isLegacyCloudinaryUrl(value: string): boolean {
  return value.startsWith('http')
}

const log = createLogger({ context: { module: 'api/trips/id' } })

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

  let updated
  try {
    ;[updated] = await db
      .update(trips)
      .set({
        ...parsed.data,
        ...(coverImageUrl !== undefined ? { coverImageUrl } : {}),
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
  const legacy = allUrls.filter((row) => isLegacyCloudinaryUrl(row.url))
  const s3Keys = allUrls.filter((row) => !isLegacyCloudinaryUrl(row.url)).map((row) => row.url)

  await Promise.allSettled([
    deleteCloudinaryAssets(
      legacy.map((row) => ({
        url: row.url,
        resourceType: row.mediaType === 'video' ? ('video' as const) : ('image' as const),
      })),
    ),
    deleteS3Objects(s3Keys),
  ])

  return apiSuccess({ id: deleted.id })
}
