import { Stack } from 'expo-router'

import { useTranslations } from '@/i18n/useTranslations'

// Native headers are not rendered inside formSheet presentations, so the sheet
// screens render their own title via AccountFormLayout
const sheetOptions = {
  presentation: 'formSheet' as const,
  headerShown: false,
  sheetGrabberVisible: true,
  sheetAllowedDetents: [0.98],
  sheetCornerRadius: 24,
}

export default function AccountLayout() {
  const t = useTranslations('account')

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: t('title') }} />
      <Stack.Screen name="portfolio" options={{ ...sheetOptions, title: t('tabs.portfolio') }} />
      <Stack.Screen name="profile" options={{ ...sheetOptions, title: t('tabs.profile') }} />
      <Stack.Screen name="security" options={{ ...sheetOptions, title: t('tabs.security') }} />
      <Stack.Screen
        name="danger"
        options={{ ...sheetOptions, sheetAllowedDetents: [0.5], title: t('tabs.danger') }}
      />
    </Stack>
  )
}
