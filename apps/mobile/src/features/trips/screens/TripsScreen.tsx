import { queryKeys, useTrips } from '@passe/hooks'
import { getUniqueStatsFromTrips } from '@passe/utils'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { PageHeader, PageHeaderDescription, PageHeaderTitle } from '@/components/ui/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { TripsList } from '@/features/trips/components/TripsList'
import { TripStatsDataWrapper } from '@/features/trips/components/TripStatsDataWrapper'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { enterUp } from '@/lib/motion'

export function TripsScreen() {
  const t = useTranslations('trips.dashboard')
  const { colors, spacing } = useTheme()
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
          gap: spacing[6],
          flexGrow: 1,
        },
        header: { flexDirection: 'column', gap: spacing[1] },
        descriptionSkeleton: { height: 20, width: 96 },
      }),
    [colors, spacing],
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Animated.View entering={enterUp(0)}>
          <PageHeader style={styles.header}>
            <PageHeaderTitle>{t('title')}</PageHeaderTitle>
            {isLoading ? (
              <Skeleton style={styles.descriptionSkeleton} />
            ) : !isError ? (
              <PageHeaderDescription>
                {t('description', { tripsCount: trips.length, countriesCount: uniqueCountries.size })}
              </PageHeaderDescription>
            ) : null}
          </PageHeader>
        </Animated.View>
        <Animated.View entering={enterUp(80)}>
          <TripStatsDataWrapper />
        </Animated.View>
        <TripsList />
      </ScrollView>
    </SafeAreaView>
  )
}
