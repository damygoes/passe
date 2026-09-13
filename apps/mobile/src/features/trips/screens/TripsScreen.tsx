import { queryKeys, useTrips } from '@passe/hooks'
import { getUniqueStatsFromTrips } from '@passe/utils'
import { useQueryClient } from '@tanstack/react-query'
import { useHeaderHeight } from 'expo-router/react-navigation'
import { useCallback, useMemo, useState } from 'react'
import { Platform, RefreshControl, StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { PageHeader, PageHeaderDescription, PageHeaderTitle } from '@/components/ui/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { TripsList } from '@/features/trips/components/trip/lists/TripsList'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { enterUp } from '@/lib/motion'

export function TripsScreen() {
  const t = useTranslations('trips.dashboard')
  const { colors, spacing } = useTheme()
  const headerHeight = useHeaderHeight()
  const { data: trips = [], isLoading, isError } = useTrips()
  const { uniqueCountries } = getUniqueStatsFromTrips({ trips })
  const queryClient = useQueryClient()
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all([
      queryClient.refetchQueries({ queryKey: queryKeys.trips() }),
      queryClient.refetchQueries({ queryKey: queryKeys.allMemories() }),
    ])
    setRefreshing(false)
  }, [queryClient])

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: colors.background },
        scroll: { flex: 1 },
        scrollContent: {
          backgroundColor: colors.background,
          padding: spacing[4],
          // iOS gets the header inset from `contentInsetAdjustmentBehavior` below —
          // adding headerHeight here too would double up the top space.
          paddingTop: Platform.OS === 'android' ? headerHeight + spacing[4] : spacing[4],
          gap: spacing[6],
          flexGrow: 1,
        },
        header: { flexDirection: 'column', gap: spacing[1] },
        descriptionSkeleton: { height: 20, width: 96 },
      }),
    [colors, spacing, headerHeight],
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior={Platform.OS === 'ios' ? 'automatic' : undefined}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Animated.View entering={enterUp(0)}>
          <PageHeader style={styles.header}>
            <PageHeaderTitle>{t('title')}</PageHeaderTitle>
            {isLoading ? (
              <Skeleton style={styles.descriptionSkeleton} />
            ) : !isError ? (
              <PageHeaderDescription>
                {t('description', {
                  tripsCount: trips.length,
                  countriesCount: uniqueCountries.size,
                })}
              </PageHeaderDescription>
            ) : null}
          </PageHeader>
        </Animated.View>
        <TripsList />
      </Animated.ScrollView>
    </SafeAreaView>
  )
}
