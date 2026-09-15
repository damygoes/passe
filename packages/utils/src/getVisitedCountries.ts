import type { Trip } from '@passe/types/trip'

type VisitedCountries = {
  visitedCountries: Set<string>
}

export function getVisitedCountries({
  allTrips,
}: {
  allTrips: Pick<Trip, 'countries'>[]
}): VisitedCountries {
  const visitedCountries = new Set(allTrips.flatMap((trip) => trip.countries))
  return {
    visitedCountries,
  }
}
