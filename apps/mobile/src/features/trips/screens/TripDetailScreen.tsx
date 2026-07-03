import { useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { MemoriesList } from '@/features/trips/components/MemoriesList'
import { TripDetailHeader } from '@/features/trips/components/TripDetailHeader'
import { useTheme } from '@/hooks/useTheme'

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
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TripDetailHeader id={id} />
        <MemoriesList tripId={id} />
      </ScrollView>
    </SafeAreaView>
  )
}
