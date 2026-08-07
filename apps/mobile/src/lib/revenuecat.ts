import { createLogger } from '@passe/logger'
import { Platform } from 'react-native'
import Purchases from 'react-native-purchases'

const log = createLogger({ context: { module: 'lib/revenuecat' } })

let configuredForUserId: string | null = null

// appUserID is set to the Clerk user ID (users.id) so RevenueCat webhook payloads carry
// app_user_id === users.id directly — no customer-ID mapping needed server-side, unlike Stripe.
export function configureRevenueCat(clerkUserId: string): void {
  if (configuredForUserId === clerkUserId) return

  const apiKey = Platform.select({
    ios: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS,
    android: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID,
  })
  if (!apiKey) {
    log.error('Missing RevenueCat API key for platform', { platform: Platform.OS })
    return
  }

  if (configuredForUserId === null) {
    Purchases.configure({ apiKey, appUserID: clerkUserId })
  } else {
    // Switching accounts within the same app session (sign out, then sign in as someone else)
    Purchases.logIn(clerkUserId).catch((err) => {
      log.error('RevenueCat logIn failed', {
        error: err instanceof Error ? err.message : String(err),
      })
    })
  }
  configuredForUserId = clerkUserId
}
