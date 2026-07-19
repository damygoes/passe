import { apiError, apiSuccess, requireAuth } from '@/lib/api'
import { MediaOwnershipError, normalizeMediaRef, resolveTripMedia } from '@/lib/media'
import { canCreateTrip, canMakePortfolioPublic } from '@passe/auth/plan-gates'
import { db, trips, users } from '@passe/db'
import { createLogger } from '@passe/logger'
import { CreateTripFormSchema, TripSchema } from '@passe/types/trip'
import { count, desc, eq } from 'drizzle-orm'

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

  const parsed = TripSchema.array().safeParse(userTrips.map(resolveTripMedia))
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
  const parsed = CreateTripFormSchema.safeParse(body)

  if (!parsed.success) {
    return apiError(JSON.stringify(parsed.error.flatten().fieldErrors), 400)
  }

  // Enforce plan limits server-side — the client mirrors these checks, but the
  // server is authoritative.
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) })
  if (!user) return apiError('User not found', 404)

  const countRows = await db
    .select({ tripCount: count() })
    .from(trips)
    .where(eq(trips.userId, userId))
  const tripCount = countRows[0]?.tripCount ?? 0

  if (!canCreateTrip(user.plan, tripCount)) {
    return apiError('Trip limit reached for your plan', 403)
  }

  if (parsed.data.isPublic && !canMakePortfolioPublic(user.plan)) {
    return apiError('Upgrade to share trips publicly', 403)
  }

  let coverImageUrl: string | null
  try {
    coverImageUrl = normalizeMediaRef(parsed.data.coverImageUrl, userId)
  } catch (err) {
    if (err instanceof MediaOwnershipError) return apiError(err.message, 400)
    throw err
  }

  let trip
  try {
    ;[trip] = await db
      .insert(trips)
      .values({ ...parsed.data, coverImageUrl, userId })
      .returning()
  } catch (err) {
    log.error('DB write failed', {
      userId,
      error: err instanceof Error ? err.message : String(err),
    })
    return apiError('Internal server error', 500)
  }

  if (!trip) return apiError('Failed to create trip', 500)

  const validatedResponse = TripSchema.safeParse(resolveTripMedia(trip))
  if (!validatedResponse.success) {
    log.error('DB output failed schema validation', {
      userId,
      issues: validatedResponse.error.issues,
    })
    return apiError('Invalid response data', 500)
  }

  log.debug('Trip created', { userId, tripId: validatedResponse.data.id })
  return apiSuccess(validatedResponse.data, 201)
}
