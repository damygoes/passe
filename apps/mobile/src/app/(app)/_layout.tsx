import { useAuth } from '@clerk/expo'
import { Redirect } from 'expo-router'
import { NativeTabs } from 'expo-router/unstable-native-tabs'

import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

export default function AppLayout() {
  const { isSignedIn, isLoaded } = useAuth()
  const t = useTranslations('nav')
  const { colors, fonts, fontSizes } = useTheme()

  if (!isLoaded) return null
  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />

  return (
    <NativeTabs
      iconColor={{ default: colors.mutedForeground, selected: colors.primary }}
      labelStyle={{ fontFamily: fonts.body, fontSize: fontSizes.xs, color: colors.mutedForeground }}
      minimizeBehavior="onScrollDown"
    >
      <NativeTabs.Trigger name="trips">
        <NativeTabs.Trigger.Label>{t('trips')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="suitcase.fill" md="luggage" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="map/index">
        <NativeTabs.Trigger.Label>{t('map')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="globe.americas.fill" md="public" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="account">
        <NativeTabs.Trigger.Label>{t('account')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}
