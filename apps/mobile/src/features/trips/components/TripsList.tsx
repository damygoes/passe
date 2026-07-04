import { useTrips } from '@passe/hooks'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { NoTripsEmpty } from './NoTripsEmpty'
import { TripCard } from './TripCard'
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
    <View style={styles.list}>
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          onPress={() => router.push(`/(app)/trips/${trip.id}`)}
        />
      ))}
    </View>
  )
}
