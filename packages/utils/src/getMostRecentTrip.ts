import type { Trip } from '@passe/types/trip'

/**
 * The trip nav shortcuts ("New memory", "Keepsakes") jump straight to —
 * the most recently created trip, or null if the user has none yet.
 */
export function getMostRecentTrip<T extends Pick<Trip, 'id' | 'createdAt'>>(trips: T[]): T | null {
  if (trips.length === 0) return null
  return trips.reduce((mostRecent, trip) =>
    new Date(trip.createdAt) > new Date(mostRecent.createdAt) ? trip : mostRecent,
  )
}
