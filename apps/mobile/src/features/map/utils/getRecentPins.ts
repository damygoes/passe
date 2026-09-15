import type { MapPoint } from '@passe/types/memory'
import type { Trip } from '@passe/types/trip'
import { formatTripDate } from '@passe/utils'

export interface RecentPin {
  id: string
  name: string
  meta: string
}

const DEFAULT_LIMIT = 4

// One row per place, not per memory — logging several memories in the same
// city on one trip would otherwise flood this list with duplicate rows.
// MapPoint has no capturedAt of its own (see apps/web's MapDataWrapper for
// the same tradeoff), so both recency and the meta date come from each
// point's trip startDate rather than the individual memory's date.
export function getRecentPins(
  points: MapPoint[],
  trips: Pick<Trip, 'id' | 'startDate'>[],
  limit = DEFAULT_LIMIT,
): RecentPin[] {
  const tripStartDateById = new Map(trips.map((trip) => [trip.id, new Date(trip.startDate)]))

  const latestByPlace = new Map<string, { name: string; country: string | null; date: Date }>()
  for (const point of points) {
    if (!point.city) continue
    const date = tripStartDateById.get(point.tripId)
    if (!date) continue
    const key = `${point.city}|${point.country ?? ''}`
    const existing = latestByPlace.get(key)
    if (!existing || date > existing.date) {
      latestByPlace.set(key, { name: point.city, country: point.country ?? null, date })
    }
  }

  return [...latestByPlace.entries()]
    .sort(([, a], [, b]) => b.date.getTime() - a.date.getTime())
    .slice(0, limit)
    .map(([key, place]) => ({
      id: key,
      name: place.name,
      meta: place.country
        ? `${place.country.toUpperCase()} · ${formatTripDate(place.date).toUpperCase()}`
        : formatTripDate(place.date).toUpperCase(),
    }))
}
