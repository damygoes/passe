import '@/i18n/polyfills'

import { ClerkProvider, useAuth } from '@clerk/expo'
import { tokenCache } from '@clerk/expo/token-cache'
import { PasseApiProvider } from '@passe/hooks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import { Stack } from 'expo-router'
import { Platform } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Sentry from '@sentry/react-native'

import { useEffect } from 'react'

import { useAppStateFocusManager } from '@/hooks/useAppStateFocusManager'
import { I18nProvider } from '@/i18n/I18nProvider'
import { configureRevenueCat } from '@/lib/revenuecat'

WebBrowser.maybeCompleteAuthSession()

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.2,
  integrations: [Sentry.reactNavigationIntegration()],
})

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60, refetchOnWindowFocus: 'always' } },
})

function getRequiredEnvVar(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing ${name} — set it in apps/mobile/.env.local`)
  }
  return value
}

const publishableKey = getRequiredEnvVar(
  'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY',
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
)
const rawApiUrl = getRequiredEnvVar('EXPO_PUBLIC_API_URL', process.env.EXPO_PUBLIC_API_URL)
// Android emulator can't resolve the host machine's `localhost` — it needs the 10.0.2.2 alias.
// iOS Simulator shares the host's network namespace, so `localhost` works there unchanged.
const apiUrl = Platform.OS === 'android' ? rawApiUrl.replace('localhost', '10.0.2.2') : rawApiUrl

function ApiConnectedApp() {
  const { getToken, userId } = useAuth()

  // Deferred until Clerk resolves a real userId — there's no anonymous-purchase flow to
  // support since the paywall is only reachable from within the authenticated app.
  useEffect(() => {
    if (userId) configureRevenueCat(userId)
  }, [userId])

  return (
    <PasseApiProvider baseUrl={apiUrl} getToken={getToken}>
      <Stack screenOptions={{ headerShown: false }} />
    </PasseApiProvider>
  )
}

function RootLayout() {
  useAppStateFocusManager()

  return (
    <>
      <StatusBar style="auto" />
      <I18nProvider>
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
          <QueryClientProvider client={queryClient}>
            <ApiConnectedApp />
          </QueryClientProvider>
        </ClerkProvider>
      </I18nProvider>
    </>
  )
}

export default Sentry.wrap(RootLayout)
