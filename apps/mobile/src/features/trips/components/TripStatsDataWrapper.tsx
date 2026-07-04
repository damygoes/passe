import { useAllMemories, useTrips } from '@passe/hooks'
import { getUniqueCities, getUniqueStatsFromTrips } from '@passe/utils'

import { Skeleton } from '@/components/ui/skeleton'
import { TripStats } from './TripStats'

export function TripStatsDataWrapper() {
  const { data: trips = [], isLoading: tripsLoading, isError: tripsError } = useTrips()
  const {
    data: allMemories = [],
    isLoading: memoriesLoading,
    isError: memoriesError,
  } = useAllMemories()
  const { uniqueCountries, uniqueYears } = getUniqueStatsFromTrips({ trips })
  const { uniqueCities } = getUniqueCities({ allMemories })

  if (tripsLoading || memoriesLoading) {
    return <Skeleton style={{ height: 96, width: '100%' }} />
  }

  if (tripsError || memoriesError) {
    return null
  }

  if (trips.length === 0) {
    return null
  }

  return (
    <TripStats
      countriesCount={uniqueCountries.size}
      citiesCount={uniqueCities.size}
      yearsCount={uniqueYears.size}
    />
  )
}
