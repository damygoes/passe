import { queryKeys, useTrips } from '@passe/hooks'
import { getUniqueStatsFromTrips } from '@passe/utils'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import type { LayoutChangeEvent } from 'react-native'
import { RefreshControl, StyleSheet } from 'react-native'
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { PageHeader, PageHeaderDescription, PageHeaderTitle } from '@/components/ui/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { TripsList } from '@/features/trips/components/TripsList'
import { TripStatsDataWrapper } from '@/features/trips/components/TripStatsDataWrapper'
import { TripStatsStickyBarDataWrapper } from '@/features/trips/components/TripStatsStickyBarDataWrapper'
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

  const scrollY = useSharedValue(0)
  const statsBottom = useSharedValue(0)
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y
  })
  const onStatsLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { y, height } = event.nativeEvent.layout
      statsBottom.set(y + height)
    },
    [statsBottom],
  )

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
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
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
        <Animated.View entering={enterUp(80)} onLayout={onStatsLayout}>
          <TripStatsDataWrapper />
        </Animated.View>
        <TripsList />
      </Animated.ScrollView>
      <TripStatsStickyBarDataWrapper scrollY={scrollY} threshold={statsBottom} />
    </SafeAreaView>
  )
}
