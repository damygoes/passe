import { useLocalSearchParams } from 'expo-router'
import { useHeaderHeight } from 'expo-router/react-navigation'
import { useMemo } from 'react'
import { Platform, ScrollView, StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { MemoriesList } from '@/features/trips/components/memories/MemoriesList'
import { TripDetailHeader } from '@/features/trips/components/trip/trip-detail/TripDetailHeader'
import { useTheme } from '@/hooks/useTheme'
import { enterUp } from '@/lib/motion'

export function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { colors, spacing } = useTheme()
  const headerHeight = useHeaderHeight()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: colors.background },
        scrollContent: {
          padding: spacing[4],
          // iOS gets the header inset from `contentInsetAdjustmentBehavior` below —
          // adding headerHeight here too would double up the top space.
          paddingTop: Platform.OS === 'android' ? headerHeight + spacing[4] : spacing[4],
          gap: spacing[8],
        },
      }),
    [colors, spacing, headerHeight],
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior={Platform.OS === 'ios' ? 'automatic' : undefined}
      >
        <Animated.View entering={enterUp(0)}>
          <TripDetailHeader id={id} />
        </Animated.View>
        <Animated.View entering={enterUp(80)}>
          <MemoriesList tripId={id} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  )
}
