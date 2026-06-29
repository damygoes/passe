import { apiError, apiSuccess, requireAuth } from '@/lib/api'
import { db, memories, trips } from '@passe/db'
import { createLogger } from '@passe/logger'
import { CreateMemorySchema, MemorySchema } from '@passe/types/memory'
import { and, desc, eq } from 'drizzle-orm'

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
  })

  const parsed = MemorySchema.array().safeParse(tripMemories)
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

  const body = await req.json()
  const parsed = CreateMemorySchema.safeParse({ ...body, tripId })

  if (!parsed.success) {
    return apiError(JSON.stringify(parsed.error.flatten().fieldErrors), 400)
  }

  let memory
  try {
    ;[memory] = await db
      .insert(memories)
      .values({ ...parsed.data, userId })
      .returning()
  } catch (err) {
    log.error('DB write failed', {
      tripId,
      error: err instanceof Error ? err.message : String(err),
    })
    return apiError('Internal server error', 500)
  }

  const validatedResponse = MemorySchema.safeParse(memory)
  if (!validatedResponse.success) {
    log.error('DB output failed schema validation', {
      tripId,
      issues: validatedResponse.error.issues,
    })
    return apiError('Invalid response data', 500)
  }

  return apiSuccess(validatedResponse.data, 201)
}
