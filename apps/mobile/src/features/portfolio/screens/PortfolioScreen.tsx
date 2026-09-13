import { useAllMemories, useTrips, useUser } from '@passe/hooks'
import { getUniqueCities, getUniqueStatsFromTrips } from '@passe/utils'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Skeleton } from '@/components/ui/skeleton'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { TripCard } from '@/features/trips/components/trip/card/TripCard'
import { TripCardSkeleton } from '@/features/trips/components/trip/card/TripCardSkeleton'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { enterUp, LIST_STAGGER_MS, MAX_STAGGER_DELAY_MS } from '@/lib/motion'
import { NoPublicTripsEmpty } from '@/features/portfolio/components/NoPublicTripsEmpty'
import { PortfolioHeader } from '@/features/portfolio/components/PortfolioHeader'

export function PortfolioScreen() {
  const t = useTranslations('portfolio')
  const { colors, spacing } = useTheme()
  const router = useRouter()
  const { data: user, isLoading: userLoading, isError: userError } = useUser()
  const { data: trips = [], isLoading: tripsLoading, isError: tripsError } = useTrips()
  const {
    data: allMemories = [],
    isLoading: memoriesLoading,
    isError: memoriesError,
  } = useAllMemories()

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
  const publicMemories = allMemories.filter((memory) => memory.isPublic)
  const { uniqueCountries, uniqueYears } = getUniqueStatsFromTrips({ trips: publicTrips })
  const { uniqueCities } = getUniqueCities({ allMemories: publicMemories })

  const isLoading = userLoading || tripsLoading || memoriesLoading
  const isError = userError || tripsError || memoriesError || (!isLoading && !user)

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <>
            <Skeleton style={styles.headerSkeleton} />
            <View style={styles.list}>
              <TripCardSkeleton />
              <TripCardSkeleton />
              <TripCardSkeleton />
            </View>
          </>
        ) : isError || !user ? (
          <ErrorBanner message={t('error')} />
        ) : (
          <>
            <Animated.View entering={enterUp(0)}>
              <PortfolioHeader
                user={user}
                tripCount={publicTrips.length}
                countriesCount={uniqueCountries.size}
                citiesCount={uniqueCities.size}
                yearsCount={uniqueYears.size}
              />
            </Animated.View>
            {publicTrips.length === 0 ? (
              <NoPublicTripsEmpty displayName={user.displayName} />
            ) : (
              <View style={styles.list}>
                {publicTrips.map((trip, index) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    entranceDelay={Math.min((index + 1) * LIST_STAGGER_MS, MAX_STAGGER_DELAY_MS)}
                    tilt={index % 2 === 0 ? -0.8 : 0.8}
                    onPress={() => {
                      router.dismiss()
                      router.push(`/(app)/trips/${trip.id}`)
                    }}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
