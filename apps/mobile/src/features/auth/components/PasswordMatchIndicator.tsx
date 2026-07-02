import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

interface PasswordMatchIndicatorProps {
  password: string
  confirmPassword: string
}

export function PasswordMatchIndicator({ password, confirmPassword }: PasswordMatchIndicatorProps) {
  const { colors, palette, spacing, fontSizes } = useTheme()
  const t = useTranslations('auth.password_match')

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: { flexDirection: 'row', alignItems: 'center', gap: spacing[1] },
        text: { fontSize: fontSizes.xs },
      }),
    [spacing, fontSizes],
  )

  if (!password || !confirmPassword) return null

  const matches = password === confirmPassword
  const color = matches ? palette.deepOlive.DEFAULT : colors.destructive

  return (
    <View style={styles.row}>
      <Icon name={matches ? 'check' : 'close'} size="xs" color={color} />
      <Text style={[styles.text, { color }]}>{matches ? t('match') : t('no_match')}</Text>
    </View>
  )
}
