import { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { StatsListDataWrapper } from '@/features/account/components/StatsListDataWrapper'
import { useTheme } from '@/hooks/useTheme'

export function StatsScreen() {
  const { colors } = useTheme()

  const styles = useMemo(
    () => StyleSheet.create({ safeArea: { flex: 1, backgroundColor: colors.background } }),
    [colors],
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <StatsListDataWrapper />
    </SafeAreaView>
  )
}
