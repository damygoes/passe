import { useAllMemories, useTrips } from '@passe/hooks'
import { getUniqueCities, getUniqueStatsFromTrips } from '@passe/utils'

import { Skeleton } from '@/components/ui/skeleton'
import { PersonalStats } from './PersonalStats'

export function PersonalStatsDataWrapper() {
  const { data: trips = [], isLoading: tripsLoading, isError: tripsError } = useTrips()
  const {
    data: allMemories = [],
    isLoading: memoriesLoading,
    isError: memoriesError,
  } = useAllMemories()
  const { uniqueCountries, uniqueYears } = getUniqueStatsFromTrips({ trips })
  const { uniqueCities } = getUniqueCities({ allMemories })

  if (tripsLoading || memoriesLoading) {
    return <Skeleton style={{ height: 110, width: '100%', borderRadius: 16 }} />
  }

  if (tripsError || memoriesError) {
    return null
  }

  if (trips.length === 0) {
    return null
  }

  return (
    <PersonalStats
      countriesCount={uniqueCountries.size}
      citiesCount={uniqueCities.size}
      yearsCount={uniqueYears.size}
    />
  )
}
