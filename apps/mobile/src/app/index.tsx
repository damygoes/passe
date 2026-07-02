import { Button } from '@/components/ui/button/Button'
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
          backgroundColor: colors.background,
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
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          gap: 6,
        }}
      >
        <Button>Save</Button>

        <Button variant="secondary">Cancel</Button>

        <Button variant="danger">Delete</Button>

        <Button variant="ghost">Back</Button>

        <Button size="sm">Small</Button>

        <Button size="lg">Large</Button>

        <Button fullWidth>Continue</Button>

        <Button loading>Saving...</Button>
      </View>
    </View>
  )
}
