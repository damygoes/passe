import { apiError, apiSuccess, requireAuth } from '@/lib/api/api'
import { db, memories, trips } from '@passe/db'
import { createLogger } from '@passe/logger'
import { ReorderMemoriesSchema } from '@passe/types/memory'
import { and, eq, sql } from 'drizzle-orm'

const log = createLogger({ context: { module: 'api/trips/id/memories/reorder' } })

// PATCH /api/trips/[id]/memories/reorder
// Persists a full display order for the trip's memories in one statement.
export async function PATCH(req: Request, ctx: RouteContext<'/api/trips/[id]/memories/reorder'>) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { id: tripId } = await ctx.params

  const trip = await db.query.trips.findFirst({
    where: and(eq(trips.id, tripId), eq(trips.userId, userId)),
  })
  if (!trip) return apiError('Trip not found', 404)

  const body = await req.json()
  const parsed = ReorderMemoriesSchema.safeParse(body)
  if (!parsed.success) {
    return apiError(JSON.stringify(parsed.error.flatten().fieldErrors), 400)
  }

  // Single-statement bulk update (Neon HTTP has no transactions). Ids are
  // bound as one jsonb param; ordinality is the new sort position. The
  // trip/user filters make ids outside the trip a silent no-op.
  const orderedJson = JSON.stringify(parsed.data.orderedIds)
  try {
    await db.execute(sql`
      UPDATE ${memories} AS m
      SET sort_order = t.ord - 1, updated_at = now()
      FROM jsonb_array_elements_text(${orderedJson}::jsonb) WITH ORDINALITY AS t(id, ord)
      WHERE m.id = t.id::uuid AND m.trip_id = ${tripId} AND m.user_id = ${userId}
    `)
  } catch (err) {
    log.error('DB write failed', {
      tripId,
      error: err instanceof Error ? err.message : String(err),
    })
    return apiError('Internal server error', 500)
  }

  return apiSuccess({ tripId, count: parsed.data.orderedIds.length })
}
