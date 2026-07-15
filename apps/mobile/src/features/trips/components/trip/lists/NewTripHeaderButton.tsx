import { router } from 'expo-router'
import { Pressable } from 'react-native'

import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

export function NewTripHeaderButton() {
  const { colors } = useTheme()
  const t = useTranslations('trips.new')

  return (
    <Pressable
      onPress={() => router.push('/(app)/trips/new')}
      accessibilityLabel={t('title')}
      hitSlop={8}
    >
      <Icon name="plus" size="lg" color={colors.primary} />
    </Pressable>
  )
}
