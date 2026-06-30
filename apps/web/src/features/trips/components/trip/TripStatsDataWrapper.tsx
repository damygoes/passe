'use client'

import { useAllMemories, useTrips } from '@passe/hooks'
import { Skeleton } from '@passe/ui'
import { getUniqueCities } from '../../utils/getUniqueCities'
import { getUniqueStatsFromTrips } from '../../utils/getUniqueStatsFromTrips'
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
    return <Skeleton className="h-24 w-full" />
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
