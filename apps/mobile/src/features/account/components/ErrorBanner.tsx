import { useMemo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

interface ErrorBannerProps {
  message: string
  onRetry?: () => void
  onDismiss?: () => void
}

export function ErrorBanner({ message, onRetry, onDismiss }: ErrorBannerProps) {
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
        row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing[2] },
        text: { flex: 1, fontSize: fontSizes.sm, color: colors.destructive },
      }),
    [colors, spacing, fontSizes],
  )

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <View style={styles.row}>
        <Text style={styles.text}>{message}</Text>
        {onDismiss && (
          <Pressable onPress={onDismiss} accessibilityLabel={tErrors('dismiss')} hitSlop={8}>
            <Icon name="close" size="xs" color={colors.destructive} />
          </Pressable>
        )}
      </View>
      {onRetry ? (
        <Button variant="secondary" size="sm" onPress={onRetry}>
          {tErrors('retry')}
        </Button>
      ) : null}
    </View>
  )
}
