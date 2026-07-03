import { useTrips, useUser } from '@passe/hooks'
import { useMemo } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Skeleton } from '@/components/ui/skeleton'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { TripCard } from '@/features/trips/components/TripCard'
import { TripsListSkeleton } from '@/features/trips/components/TripsListSkeleton'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { NoPublicTripsEmpty } from '@/features/portfolio/components/NoPublicTripsEmpty'
import { PortfolioHeader } from '@/features/portfolio/components/PortfolioHeader'

export function PortfolioScreen() {
  const t = useTranslations('portfolio')
  const { colors, spacing } = useTheme()
  const { data: user, isLoading: userLoading, isError: userError } = useUser()
  const { data: trips = [], isLoading: tripsLoading, isError: tripsError } = useTrips()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: colors.background },
        scrollContent: { padding: spacing[6], gap: spacing[6] },
        headerSkeleton: { height: 96, width: '100%' },
        list: { gap: spacing[4] },
      }),
    [colors, spacing],
  )

  const publicTrips = trips.filter((trip) => trip.isPublic)

  const isLoading = userLoading || tripsLoading
  const isError = userError || tripsError || (!isLoading && !user)

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <>
            <Skeleton style={styles.headerSkeleton} />
            <TripsListSkeleton />
          </>
        ) : isError || !user ? (
          <ErrorBanner message={t('error')} />
        ) : (
          <>
            <PortfolioHeader user={user} tripCount={publicTrips.length} />
            {publicTrips.length === 0 ? (
              <NoPublicTripsEmpty displayName={user.displayName} />
            ) : (
              <View style={styles.list}>
                {publicTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
