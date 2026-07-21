import { apiError, apiSuccess, requireAuth } from '@/lib/api/api'
import { geocodeCityCountry } from '@/lib/geocode/geocode'
import { MediaOwnershipError, normalizeMediaRef } from '@/lib/media/media'
import { generateMediaPlaceholder } from '@/lib/media/media-placeholder'
import { fromDbMemory, toDbMemoryValues } from '@/lib/memory/memory'
import { db, memories, memoryMedia, trips, users } from '@passe/db'
import { canAddMemory } from '@passe/auth/plan-gates'
import { createLogger } from '@passe/logger'
import { CreateMemoryFormSchema, MemorySchema } from '@passe/types/memory'
import { and, asc, count, desc, eq } from 'drizzle-orm'

const log = createLogger({ context: { module: 'api/trips/id/memories' } })

// GET /api/trips/[id]/memories
export async function GET(_req: Request, ctx: RouteContext<'/api/trips/[id]/memories'>) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { id: tripId } = await ctx.params

  // Verify the trip belongs to the current user
  const trip = await db.query.trips.findFirst({
    where: and(eq(trips.id, tripId), eq(trips.userId, userId)),
  })

  if (!trip) return apiError('Trip not found', 404)

  const tripMemories = await db.query.memories.findMany({
    where: eq(memories.tripId, tripId),
    orderBy: desc(memories.capturedAt),
    with: { media: { orderBy: asc(memoryMedia.sortOrder) } },
  })

  const parsed = MemorySchema.array().safeParse(tripMemories.map(fromDbMemory))
  if (!parsed.success) {
    log.error('DB output failed schema validation', { tripId, issues: parsed.error.issues })
    return apiError('Invalid memory data', 500)
  }

  return apiSuccess(parsed.data)
}

// POST /api/trips/[id]/memories
export async function POST(req: Request, ctx: RouteContext<'/api/trips/[id]/memories'>) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { id: tripId } = await ctx.params

  // Verify the trip belongs to the current user
  const trip = await db.query.trips.findFirst({
    where: and(eq(trips.id, tripId), eq(trips.userId, userId)),
  })

  if (!trip) return apiError('Trip not found', 404)

  const [user] = await db
    .select({ plan: users.plan })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
  if (!user) return apiError('User not found', 404)

  const countResult = await db
    .select({ memoryCount: count() })
    .from(memories)
    .where(eq(memories.tripId, tripId))
  const currentCount = countResult[0]?.memoryCount ?? 0

  if (!canAddMemory(user.plan, currentCount)) {
    return apiError('Memory limit reached for your plan', 403)
  }

  const body = await req.json()
  const parsed = CreateMemoryFormSchema.safeParse({ ...body, tripId })

  if (!parsed.success) {
    return apiError(JSON.stringify(parsed.error.flatten().fieldErrors), 400)
  }

  // A brand-new memory always gets a best-effort location: use the precise
  // GPS coordinates if the client sent them, otherwise fall back to
  // geocoding the city/country the user typed.
  const dataForDb =
    parsed.data.location == null
      ? {
          ...parsed.data,
          location: await geocodeCityCountry(parsed.data.city, parsed.data.country),
        }
      : parsed.data

  let memory
  try {
    ;[memory] = await db
      .insert(memories)
      .values({ ...toDbMemoryValues(dataForDb), userId })
      .returning()
  } catch (err) {
    log.error('DB write failed', {
      tripId,
      error: err instanceof Error ? err.message : String(err),
    })
    return apiError('Internal server error', 500)
  }

  if (!memory) return apiError('Failed to create memory', 500)

  // The Neon HTTP driver has no transactions — insert media after the memory
  // row and roll the memory back manually if the media insert fails.
  let mediaRows: (typeof memoryMedia.$inferSelect)[] = []
  if (parsed.data.media.length > 0) {
    let normalizedMedia: typeof parsed.data.media
    try {
      normalizedMedia = parsed.data.media.map((item) => ({
        ...item,
        url: normalizeMediaRef(item.url, userId)!,
      }))
    } catch (err) {
      await db
        .delete(memories)
        .where(eq(memories.id, memory.id))
        .catch(() => undefined)
      if (err instanceof MediaOwnershipError) return apiError(err.message, 400)
      throw err
    }

    const placeholders = await Promise.all(
      normalizedMedia.map((item) =>
        item.mediaType === 'photo' ? generateMediaPlaceholder(item.url) : null,
      ),
    )

    try {
      mediaRows = await db
        .insert(memoryMedia)
        .values(
          normalizedMedia.map((item, index) => ({
            memoryId: memory.id,
            url: item.url,
            mediaType: item.mediaType,
            sortOrder: index,
            width: item.width ?? null,
            height: item.height ?? null,
            placeholder: placeholders[index] ?? null,
          })),
        )
        .returning()
    } catch (err) {
      log.error('DB write failed for memory media, rolling back memory', {
        tripId,
        memoryId: memory.id,
        error: err instanceof Error ? err.message : String(err),
      })
      await db
        .delete(memories)
        .where(eq(memories.id, memory.id))
        .catch(() => undefined)
      return apiError('Internal server error', 500)
    }
  }

  const validatedResponse = MemorySchema.safeParse(fromDbMemory({ ...memory, media: mediaRows }))
  if (!validatedResponse.success) {
    log.error('DB output failed schema validation', {
      tripId,
      issues: validatedResponse.error.issues,
    })
    return apiError('Invalid response data', 500)
  }

  return apiSuccess(validatedResponse.data, 201)
}
