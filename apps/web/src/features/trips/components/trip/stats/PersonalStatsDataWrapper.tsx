'use client'

import { useAllMemories, useTrips } from '@passe/hooks'
import { Skeleton } from '@passe/ui'
import { getUniqueCities, getUniqueStatsFromTrips } from '@passe/utils'
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
    return (
      <div className="grid w-full grid-cols-3 gap-3 sm:gap-4">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </div>
    )
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
