import { useTheme } from '@/hooks/useTheme'
import { resolveLineHeight } from '@/theme'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function Index() {
  const { colors, spacing, fonts, fontSizes, fontWeights, lineHeights } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primary,
          padding: spacing[4],
        },
        text: {
          fontFamily: fonts.body,
          fontSize: fontSizes.base,
          fontWeight: fontWeights.regular,
          lineHeight: resolveLineHeight(fontSizes.base, lineHeights.normal),
          color: colors.primaryForeground,
        },
      }),
    [colors, spacing, fonts, fontSizes, fontWeights, lineHeights],
  )

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edit src/app/index.tsx to edit this screen.</Text>
    </View>
  )
}
