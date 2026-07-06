import { apiError, apiSuccess, requireAuth } from '@/lib/api'
import { geocodeCityCountry } from '@/lib/geocode'
import { fromDbMemory, toDbMemoryValues } from '@/lib/memory'
import { db, memories, memoryMedia, users } from '@passe/db'
import { canMakeMemoryPublic } from '@passe/auth/plan-gates'
import { createLogger } from '@passe/logger'
import { MemorySchema, UpdateMemorySchema } from '@passe/types/memory'
import { and, asc, count, eq, ne } from 'drizzle-orm'

const log = createLogger({ context: { module: 'api/trips/id/memories/id' } })

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
      ? { ...parsed.data, location: await geocodeCityCountry(parsed.data.city, parsed.data.country) }
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
    try {
      await db.delete(memoryMedia).where(eq(memoryMedia.memoryId, memoryId))
      if (parsed.data.media.length > 0) {
        await db.insert(memoryMedia).values(
          parsed.data.media.map((item, index) => ({
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

  return apiSuccess({ id: deleted.id })
}
