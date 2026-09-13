import { useAllMemories, useTrips, useUser } from '@passe/hooks'
import { getUniqueCities, getUniqueStatsFromTrips } from '@passe/utils'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Skeleton } from '@/components/ui/skeleton'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { NoPublicTripsEmpty } from '@/features/portfolio/components/NoPublicTripsEmpty'
import { PortfolioHeader } from '@/features/portfolio/components/PortfolioHeader'
import { PortfolioTripCard } from '@/features/portfolio/components/PortfolioTripCard'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { enterUp, LIST_STAGGER_MS, MAX_STAGGER_DELAY_MS } from '@/lib/motion'

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
        headerSkeleton: { height: 260, width: '100%' },
        list: { gap: spacing[8] },
      }),
    [colors, spacing],
  )

  const publicTrips = trips.filter((trip) => trip.isPublic)
  const publicMemories = allMemories.filter((memory) => memory.isPublic)
  const { uniqueCountries } = getUniqueStatsFromTrips({ trips: publicTrips })
  const { uniqueCities } = getUniqueCities({ allMemories: publicMemories })

  const isLoading = userLoading || tripsLoading || memoriesLoading
  const isError = userError || tripsError || memoriesError || (!isLoading && !user)

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <Skeleton style={styles.headerSkeleton} />
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
              />
            </Animated.View>
            {publicTrips.length === 0 ? (
              <NoPublicTripsEmpty displayName={user.displayName} />
            ) : (
              <View style={styles.list}>
                {publicTrips.map((trip, index) => (
                  <Animated.View
                    key={trip.id}
                    entering={enterUp(
                      Math.min((index + 1) * LIST_STAGGER_MS, MAX_STAGGER_DELAY_MS),
                    )}
                  >
                    <PortfolioTripCard
                      trip={trip}
                      onPress={() => {
                        router.dismiss()
                        router.push(`/(app)/trips/public/${trip.id}`)
                      }}
                    />
                  </Animated.View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
