import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

interface ErrorBannerProps {
  message: string
  onRetry?: () => void
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  const { colors, spacing, fontSizes } = useTheme()
  const tErrors = useTranslations('account.errors')

  const styles = useMemo(
    () =>
      StyleSheet.create({
        banner: {
          borderRadius: 12,
          borderWidth: 1,
          borderColor: `${colors.destructive}33`,
          backgroundColor: `${colors.destructive}1A`,
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[3],
          gap: spacing[3],
        },
        text: { fontSize: fontSizes.sm, color: colors.destructive },
      }),
    [colors, spacing, fontSizes],
  )

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.text}>{message}</Text>
      {onRetry ? (
        <Button variant="secondary" size="sm" onPress={onRetry}>
          {tErrors('retry')}
        </Button>
      ) : null}
    </View>
  )
}
