import { Stack } from 'expo-router'

import { useTranslations } from '@/i18n/useTranslations'

export default function AccountLayout() {
  const t = useTranslations('account')

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: t('title') }} />
      <Stack.Screen name="profile" options={{ title: t('tabs.profile') }} />
      <Stack.Screen name="security" options={{ title: t('tabs.security') }} />
      <Stack.Screen name="danger" options={{ title: t('tabs.danger') }} />
    </Stack>
  )
}
