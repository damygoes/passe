import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'

interface UpgradeBannerProps {
  message: string
  ctaLabel: string
  onPressUpgrade: () => void
}

export function UpgradeBanner({ message, ctaLabel, onPressUpgrade }: UpgradeBannerProps) {
  const { colors, spacing, fontSizes, borderRadius } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        banner: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: spacing[3],
          borderRadius: borderRadius.lg,
          borderWidth: 1,
          borderColor: `${colors.primary}33`,
          backgroundColor: `${colors.primary}14`,
          padding: spacing[4],
        },
        iconWrap: { paddingTop: 2 },
        textGroup: { flex: 1, gap: spacing[3] },
        message: { fontSize: fontSizes.sm, color: colors.foreground },
      }),
    [colors, spacing, fontSizes, borderRadius],
  )

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <View style={styles.iconWrap}>
        <Icon name="lock" size="md" color={colors.primary} />
      </View>
      <View style={styles.textGroup}>
        <Text style={styles.message}>{message}</Text>
        <Button size="sm" variant="primary" onPress={onPressUpgrade}>
          {ctaLabel}
        </Button>
      </View>
    </View>
  )
}
