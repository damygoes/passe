import { useAuth } from '@clerk/expo'
import { Redirect, Tabs } from 'expo-router'

import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

export default function AppLayout() {
  const { isSignedIn, isLoaded } = useAuth()
  const t = useTranslations('nav')
  const { colors, fonts, fontSizes } = useTheme()

  if (!isLoaded) return null
  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
        tabBarLabelStyle: { fontFamily: fonts.body, fontSize: fontSizes.xs },
      }}
    >
      <Tabs.Screen
        name="trips"
        options={{
          title: t('trips'),
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name="luggage"
              size="lg"
              color={color as string}
              strokeWidth={focused ? 2 : 1.5}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map/index"
        options={{
          title: t('map'),
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Icon name="map" size="lg" color={color as string} strokeWidth={focused ? 2 : 1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t('account'),
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Icon name="user" size="lg" color={color as string} strokeWidth={focused ? 2 : 1.5} />
          ),
        }}
      />
    </Tabs>
  )
}
