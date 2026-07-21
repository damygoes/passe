import { useAllMemories, useTrips } from '@passe/hooks'
import { getUniqueCities, getUniqueStatsFromTrips } from '@passe/utils'
import type { SharedValue } from 'react-native-reanimated'

import { PersonalStatsStickyBar } from './PersonalStatsStickyBar'

interface PersonalStatsStickyBarDataWrapperProps {
  scrollY: SharedValue<number>
  threshold: SharedValue<number>
}

export function PersonalStatsStickyBarDataWrapper({
  scrollY,
  threshold,
}: PersonalStatsStickyBarDataWrapperProps) {
  const { data: trips = [], isLoading: tripsLoading, isError: tripsError } = useTrips()
  const {
    data: allMemories = [],
    isLoading: memoriesLoading,
    isError: memoriesError,
  } = useAllMemories()
  const { uniqueCountries, uniqueYears } = getUniqueStatsFromTrips({ trips })
  const { uniqueCities } = getUniqueCities({ allMemories })

  if (tripsLoading || memoriesLoading) {
    return null
  }

  if (tripsError || memoriesError) {
    return null
  }

  if (trips.length === 0) {
    return null
  }

  return (
    <PersonalStatsStickyBar
      countriesCount={uniqueCountries.size}
      citiesCount={uniqueCities.size}
      yearsCount={uniqueYears.size}
      scrollY={scrollY}
      threshold={threshold}
    />
  )
}
