import { ClerkProvider, useAuth } from '@clerk/expo'
import { tokenCache } from '@clerk/expo/token-cache'
import { PasseApiProvider } from '@passe/hooks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'

import { I18nProvider } from '@/i18n/I18nProvider'

WebBrowser.maybeCompleteAuthSession()

const queryClient = new QueryClient()

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
const apiUrl = getRequiredEnvVar('EXPO_PUBLIC_API_URL', process.env.EXPO_PUBLIC_API_URL)

function ApiConnectedApp() {
  const { getToken } = useAuth()

  return (
    <PasseApiProvider baseUrl={apiUrl} getToken={getToken}>
      <Stack screenOptions={{ headerShown: false }} />
    </PasseApiProvider>
  )
}

export default function RootLayout() {
  return (
    <I18nProvider>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <QueryClientProvider client={queryClient}>
          <ApiConnectedApp />
        </QueryClientProvider>
      </ClerkProvider>
    </I18nProvider>
  )
}
