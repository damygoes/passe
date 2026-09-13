import { queryKeys } from '@passe/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ByPlaceListDataWrapper } from '@/features/home/components/ByPlaceListDataWrapper'
import { ContinueTripCardDataWrapper } from '@/features/home/components/ContinueTripCardDataWrapper'
import { HomeHeaderDataWrapper } from '@/features/home/components/HomeHeaderDataWrapper'
import { useTheme } from '@/hooks/useTheme'
import { enterUp } from '@/lib/motion'

export function HomeScreen() {
  const { colors, spacing } = useTheme()
  const queryClient = useQueryClient()
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all([
      queryClient.refetchQueries({ queryKey: queryKeys.user() }),
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
        scrollContent: { padding: spacing[4], gap: spacing[6], flexGrow: 1 },
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
          <HomeHeaderDataWrapper />
        </Animated.View>
        <Animated.View entering={enterUp(80)}>
          <ContinueTripCardDataWrapper />
        </Animated.View>
        <Animated.View entering={enterUp(140)}>
          <ByPlaceListDataWrapper />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  )
}
