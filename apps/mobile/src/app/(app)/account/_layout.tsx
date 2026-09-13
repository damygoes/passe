import { Stack } from 'expo-router'
import { StyleSheet } from 'react-native'

import { GlassSurface } from '@/components/ui/glass-surface'
import { useTheme } from '@/hooks/useTheme'
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
  const { colors } = useTheme()

  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerShadowVisible: false,
        headerBackground: () => <GlassSurface shape="none" style={StyleSheet.absoluteFill} />,
        headerTintColor: colors.foreground,
        headerTitleStyle: { color: colors.foreground },
      }}
    >
      <Stack.Screen name="index" options={{ title: '' }} />
      <Stack.Screen name="stats" options={{ title: '' }} />
      <Stack.Screen name="portfolio" options={{ ...sheetOptions, title: t('tabs.portfolio') }} />
      <Stack.Screen name="profile" options={{ ...sheetOptions, title: t('tabs.profile') }} />
      <Stack.Screen name="security" options={{ ...sheetOptions, title: t('tabs.security') }} />
      <Stack.Screen name="paywall" options={{ ...sheetOptions, title: t('tabs.paywall') }} />
      <Stack.Screen
        name="danger"
        options={{ ...sheetOptions, sheetAllowedDetents: [0.5], title: t('tabs.danger') }}
      />
    </Stack>
  )
}
