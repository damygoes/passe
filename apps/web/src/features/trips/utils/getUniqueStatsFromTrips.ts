import type { Trip } from '@passe/types/trip'

type UniqueStatsFromTrips = {
  uniqueCountries: Set<string>
  uniqueYears: Set<number>
}

export function getUniqueStatsFromTrip({ trips }: { trips: Trip[] }): UniqueStatsFromTrips {
  const uniqueCountries = new Set(trips.flatMap((trip) => trip.countries))
  const uniqueYears = new Set(trips.map((trip) => new Date(trip.startDate).getFullYear()))

  return {
    uniqueCountries,
    uniqueYears,
  }
}
