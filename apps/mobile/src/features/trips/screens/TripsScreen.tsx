import { queryKeys, useTrips } from '@passe/hooks'
import { getUniqueStatsFromTrips } from '@passe/utils'
import { useQueryClient } from '@tanstack/react-query'
import { useHeaderHeight } from 'expo-router/react-navigation'
import { useCallback, useMemo, useState } from 'react'
import type { LayoutChangeEvent } from 'react-native'
import { Platform, RefreshControl, StyleSheet } from 'react-native'
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { PageHeader, PageHeaderDescription, PageHeaderTitle } from '@/components/ui/page-header'
import { ScrapbookTexture } from '@/components/ui/scrapbook-texture'
import { Skeleton } from '@/components/ui/skeleton'
import { TripsList } from '@/features/trips/components/trip/lists/TripsList'
import { PersonalStatsDataWrapper } from '@/features/trips/components/trip/stats/PersonalStatsDataWrapper'
import { PersonalStatsStickyBarDataWrapper } from '@/features/trips/components/trip/stats/PersonalStatsStickyBarDataWrapper'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { enterUp } from '@/lib/motion'
import { ScrapbookThemeProvider } from '@/theme/ScrapbookThemeContext'

// Wraps the themed content in the user's opt-in scrapbook preference, scoped
// to just this screen — mirrors web's `UserThemeScope` around DashboardView.
export function TripsScreen() {
  return (
    <ScrapbookThemeProvider>
      <TripsScreenContent />
    </ScrapbookThemeProvider>
  )
}

function TripsScreenContent() {
  const t = useTranslations('trips.dashboard')
  const { colors, spacing, isScrapbook } = useTheme()
  const headerHeight = useHeaderHeight()
  const { data: trips = [], isLoading, isError } = useTrips()
  const { uniqueCountries } = getUniqueStatsFromTrips({ trips })
  const queryClient = useQueryClient()
  const [refreshing, setRefreshing] = useState(false)

  const scrollY = useSharedValue(0)
  const statsBottom = useSharedValue(0)
  const scrollHandler = useAnimatedScrollHandler((event) => {
    // iOS's `contentInsetAdjustmentBehavior="automatic"` (used to inset content under the
    // glass header) offsets contentOffset.y by -contentInset.top at rest. Add it back so
    // scrollY stays 0-based, matching the layout-relative `threshold` from onStatsLayout.
    // contentInset is always {0,0,0,0} on Android, so this is a no-op there.
    scrollY.value = event.contentOffset.y + event.contentInset.top
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
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {isScrapbook && <ScrapbookTexture />}
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
          <PersonalStatsDataWrapper />
        </Animated.View>
        <TripsList />
      </Animated.ScrollView>
      <PersonalStatsStickyBarDataWrapper scrollY={scrollY} threshold={statsBottom} />
    </SafeAreaView>
  )
}
