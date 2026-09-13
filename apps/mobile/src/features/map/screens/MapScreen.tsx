import { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { MapDataWrapper } from '@/features/map/components/MapDataWrapper'
import { useTheme } from '@/hooks/useTheme'

export function MapScreen() {
  const { colors } = useTheme()

  const styles = useMemo(
    () => StyleSheet.create({ safeArea: { flex: 1, backgroundColor: colors.background } }),
    [colors],
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <MapDataWrapper />
    </SafeAreaView>
  )
}
