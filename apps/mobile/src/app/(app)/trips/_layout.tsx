import { Stack } from 'expo-router'

import { useTranslations } from '@/i18n/useTranslations'

export default function TripsLayout() {
  const t = useTranslations('nav')

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: t('trips') }} />
      <Stack.Screen name="[id]" options={{ title: '', headerBackButtonDisplayMode: 'minimal' }} />
    </Stack>
  )
}
