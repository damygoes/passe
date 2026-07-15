import { useTrips } from '@passe/hooks'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'

import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { LIST_STAGGER_MS, MAX_STAGGER_DELAY_MS } from '@/lib/motion'
import { NoTripsEmpty } from '@/features/trips/components/trip/empty/NoTripsEmpty'
import { TripCard } from '@/features/trips/components/trip/card/TripCard'
import { TripsListSkeleton } from './TripsListSkeleton'

export function TripsList() {
  const { data: trips = [], isLoading, isError } = useTrips()
  const t = useTranslations('trips.dashboard')
  const router = useRouter()
  const { spacing } = useTheme()

  const styles = useMemo(
    () => StyleSheet.create({ list: { width: '100%', gap: spacing[4] } }),
    [spacing],
  )

  if (isLoading) {
    return <TripsListSkeleton />
  }

  if (isError) {
    return <ErrorBanner message={t('trips_error')} />
  }

  if (trips.length === 0) {
    return <NoTripsEmpty />
  }

  return (
    <Animated.View entering={FadeIn.duration(200)} style={styles.list}>
      {trips.map((trip, index) => (
        <TripCard
          key={trip.id}
          trip={trip}
          onPress={() => router.push(`/(app)/trips/${trip.id}`)}
          entranceDelay={Math.min(index * LIST_STAGGER_MS, MAX_STAGGER_DELAY_MS)}
          tilt={index % 2 === 0 ? -0.8 : 0.8}
        />
      ))}
    </Animated.View>
  )
}
