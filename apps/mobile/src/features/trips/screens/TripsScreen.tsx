import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { useTheme } from '@/hooks/useTheme'

export function TripsScreen() {
  const { colors, spacing, fontSizes } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
          padding: spacing[4],
        },
        text: { fontSize: fontSizes.lg, color: colors.foreground },
      }),
    [colors, spacing, fontSizes],
  )

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Trips</Text>
    </View>
  )
}
