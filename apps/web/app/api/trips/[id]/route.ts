import { apiError, apiSuccess, requireAuth } from '@/lib/api'
import { db, trips } from '@passe/db'
import { createLogger } from '@passe/logger'
import { TripSchema, UpdateTripSchema } from '@passe/types/trip'
import { and, eq } from 'drizzle-orm'

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

  const parsed = TripSchema.safeParse(trip)
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

  let updated
  try {
    ;[updated] = await db
      .update(trips)
      .set({ ...parsed.data, updatedAt: new Date() })
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

  const validatedResponse = TripSchema.safeParse(updated)
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

  return apiSuccess({ id: deleted.id })
}
