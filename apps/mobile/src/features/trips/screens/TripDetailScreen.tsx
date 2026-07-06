import { useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { MemoriesList } from '@/features/trips/components/MemoriesList'
import { TripDetailHeader } from '@/features/trips/components/TripDetailHeader'
import { useTheme } from '@/hooks/useTheme'
import { enterUp } from '@/lib/motion'

export function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { colors, spacing } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: colors.background },
        scrollContent: { padding: spacing[4], gap: spacing[8] },
      }),
    [colors, spacing],
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
