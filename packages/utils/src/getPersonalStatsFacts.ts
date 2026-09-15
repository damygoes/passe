import type { Memory } from '@passe/types/memory'
import type { Trip } from '@passe/types/trip'

export interface FurthestMemoryFact {
  city: string | null
  country: string | null
  distanceKm: number
  capturedAt: Date
}

export interface QuietestMonthFact {
  /** 0-11, per Date#getMonth() */
  monthIndex: number
  count: number
}

// The Stats screen's non-obvious derived facts — countries/cities/years
// counts already come from getUniqueStatsFromTrips/getUniqueCities
// elsewhere, so this only covers what those don't.
export interface PersonalStatsFacts {
  /** The most-recently-first-visited country, for the Countries tile's note. */
  mostRecentCountry: string | null
  /** Cities that appear in 2+ memories. */
  repeatCitiesCount: number
  tripsCount: number
  firstTripTitle: string | null
  memoriesCount: number
  privateMemoriesCount: number
  /** Sum of each trip's (endDate - startDate) in days. */
  daysAwayCount: number
  /** The memory geographically furthest from the first geotagged memory
   *  ("home") — null if fewer than two geotagged memories exist. */
  furthestMemory: FurthestMemoryFact | null
  /** The calendar month (aggregated across all years) with the fewest
   *  memories — null if there are no memories at all. */
  quietestMonth: QuietestMonthFact | null
}

// Haversine great-circle distance, in kilometers.
function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const EARTH_RADIUS_KM = 6371
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const sinLat = Math.sin(dLat / 2)
  const sinLng = Math.sin(dLng / 2)
  const h = sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng
  return EARTH_RADIUS_KM * 2 * Math.asin(Math.sqrt(h))
}

export function getPersonalStatsFacts({
  trips,
  memories,
}: {
  trips: Trip[]
  memories: Memory[]
}): PersonalStatsFacts {
  const sortedTrips = [...trips].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  )

  // First-visit order per country, in the order trips (sorted chronologically)
  // introduce them — mostRecentCountry is the last one added.
  const countryFirstSeenOrder: string[] = []
  for (const trip of sortedTrips) {
    for (const country of trip.countries) {
      if (!countryFirstSeenOrder.includes(country)) countryFirstSeenOrder.push(country)
    }
  }

  const cityCounts = new Map<string, number>()
  for (const memory of memories) {
    if (!memory.city) continue
    cityCounts.set(memory.city, (cityCounts.get(memory.city) ?? 0) + 1)
  }
  const repeatCitiesCount = [...cityCounts.values()].filter((count) => count >= 2).length

  const daysAwayCount = trips.reduce((total, trip) => {
    const start = new Date(trip.startDate).getTime()
    const end = new Date(trip.endDate).getTime()
    return total + Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)))
  }, 0)

  const geotagged = memories.filter((memory) => memory.location != null)
  const sortedGeotagged = [...geotagged].sort(
    (a, b) => new Date(a.capturedAt).getTime() - new Date(b.capturedAt).getTime(),
  )
  const home = sortedGeotagged[0]?.location ?? null
  let furthestMemory: FurthestMemoryFact | null = null
  if (home && geotagged.length > 1) {
    for (const memory of geotagged) {
      if (!memory.location) continue
      const distance = distanceKm(home, memory.location)
      if (!furthestMemory || distance > furthestMemory.distanceKm) {
        furthestMemory = {
          city: memory.city ?? null,
          country: memory.country ?? null,
          distanceKm: Math.round(distance),
          capturedAt: memory.capturedAt,
        }
      }
    }
  }

  let quietestMonth: QuietestMonthFact | null = null
  if (memories.length > 0) {
    const countsByMonth = Array.from({ length: 12 }, () => 0)
    for (const memory of memories) {
      const monthIndex = new Date(memory.capturedAt).getMonth()
      countsByMonth[monthIndex] = (countsByMonth[monthIndex] ?? 0) + 1
    }
    const minCount = Math.min(...countsByMonth)
    const monthIndex = countsByMonth.indexOf(minCount)
    quietestMonth = { monthIndex, count: minCount }
  }

  return {
    mostRecentCountry: countryFirstSeenOrder.at(-1) ?? null,
    repeatCitiesCount,
    tripsCount: trips.length,
    firstTripTitle: sortedTrips[0]?.title ?? null,
    memoriesCount: memories.length,
    privateMemoriesCount: memories.filter((memory) => !memory.isPublic).length,
    daysAwayCount,
    furthestMemory,
    quietestMonth,
  }
}
