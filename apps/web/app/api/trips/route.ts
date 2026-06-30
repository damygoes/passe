import { apiError, apiSuccess, requireAuth } from '@/lib/api'
import { db, trips } from '@passe/db'
import { createLogger } from '@passe/logger'
import { CreateTripSchema, TripSchema } from '@passe/types/trip'
import { desc, eq } from 'drizzle-orm'

const log = createLogger({ context: { module: 'api/trips' } })

// GET /api/trips — list all trips for the current user
export async function GET() {
  const { userId, error } = await requireAuth()
  if (error) return error

  log.debug('Fetching trips', { userId })

  const userTrips = await db.query.trips.findMany({
    where: eq(trips.userId, userId),
    orderBy: desc(trips.startDate),
  })

  log.debug('DB returned trips', { userId, count: userTrips.length })

  const parsed = TripSchema.array().safeParse(userTrips)
  if (!parsed.success) {
    log.error('DB output failed schema validation', { userId, issues: parsed.error.issues })
    return apiError('Invalid trip data', 500)
  }

  return apiSuccess(parsed.data)
}

// POST /api/trips — create a new trip
export async function POST(req: Request) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const body = await req.json()
  const parsed = CreateTripSchema.safeParse(body)

  if (!parsed.success) {
    return apiError(JSON.stringify(parsed.error.flatten().fieldErrors), 400)
  }

  let trip
  try {
    ;[trip] = await db
      .insert(trips)
      .values({ ...parsed.data, userId })
      .returning()
  } catch (err) {
    log.error('DB write failed', { userId, error: err instanceof Error ? err.message : String(err) })
    return apiError('Internal server error', 500)
  }

  const validatedResponse = TripSchema.safeParse(trip)
  if (!validatedResponse.success) {
    log.error('DB output failed schema validation', { userId, issues: validatedResponse.error.issues })
    return apiError('Invalid response data', 500)
  }

  log.debug('Trip created', { userId, tripId: validatedResponse.data.id })
  return apiSuccess(validatedResponse.data, 201)
}
