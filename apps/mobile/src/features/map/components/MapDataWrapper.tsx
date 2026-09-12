import { useMapPoints, useTrips } from '@passe/hooks'
import { getVisitedCountries } from '@passe/utils'
import Animated, { FadeIn } from 'react-native-reanimated'

import { Skeleton } from '@/components/ui/skeleton'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { useTranslations } from '@/i18n/useTranslations'
import { spacing } from '@passe/theme'
import { NoGeotaggedMemoriesEmpty } from './NoGeotaggedMemoriesEmpty'
import { WorldMap } from './WorldMap'

export function MapDataWrapper() {
  const t = useTranslations('map')
  const {
    data: points = [],
    isLoading: pointsLoading,
    isError: pointsError,
    refetch,
  } = useMapPoints()
  const { data: trips = [], isLoading: tripsLoading, isError: tripsError } = useTrips()

  if (pointsLoading || tripsLoading) return <Skeleton style={{ flex: 1 }} />
  if (pointsError || tripsError) {
    return (
      <Animated.View entering={FadeIn.duration(200)} style={{ padding: spacing[8] }}>
        <ErrorBanner message={t('load_error')} onRetry={() => refetch()} />
      </Animated.View>
    )
  }
  if (points.length === 0) {
    return (
      <Animated.View entering={FadeIn.duration(200)} style={{ flex: 1, padding: spacing[8] }}>
        <NoGeotaggedMemoriesEmpty />
      </Animated.View>
    )
  }

  const { visitedCountries } = getVisitedCountries({ allTrips: trips })

  return (
    <Animated.View entering={FadeIn.duration(200)} style={{ flex: 1 }}>
      <WorldMap points={points} visitedCountries={[...visitedCountries]} />
    </Animated.View>
  )
}
