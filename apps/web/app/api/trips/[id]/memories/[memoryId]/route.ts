import { apiError, apiSuccess, requireAuth } from '@/lib/api'
import { db, memories } from '@passe/db'
import { createLogger } from '@passe/logger'
import { MemorySchema, UpdateMemorySchema } from '@passe/types/memory'
import { and, eq } from 'drizzle-orm'

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

  let updated
  try {
    ;[updated] = await db
      .update(memories)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(and(eq(memories.id, memoryId), eq(memories.tripId, tripId), eq(memories.userId, userId)))
      .returning()
  } catch (err) {
    log.error('DB write failed', {
      memoryId,
      error: err instanceof Error ? err.message : String(err),
    })
    return apiError('Internal server error', 500)
  }

  if (!updated) return apiError('Memory not found', 404)

  const validatedResponse = MemorySchema.safeParse(updated)
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
      .where(and(eq(memories.id, memoryId), eq(memories.tripId, tripId), eq(memories.userId, userId)))
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
