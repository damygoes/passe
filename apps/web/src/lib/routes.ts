import type { GatedFeature } from '@passe/auth/plan-gates'

export const routes = {
  home: '/',
  dashboard: '/dashboard',
  signIn: '/sign-in',
  signUp: '/sign-up',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  ssoCallback: '/sso-callback',
  trips: '/trips',
  tripsNew: '/trips/new',
  account: '/account',
  billing: '/billing',
  map: '/map',
  stats: '/stats',
  privacyPolicy: '/privacy-policy',
  termsOfService: '/terms-of-service',
  support: '/support',
  impressum: '/impressum',
} as const

// Billing doubles as the paywall, so an upgrade CTA tags itself with the feature
// the user was blocked on and the plan cards highlight whichever plan unlocks it.
// `routes.billing` stays for the untagged account entries.
export const billingRoute = (reason?: GatedFeature) =>
  reason ? (`${routes.billing}?reason=${reason}` as const) : routes.billing

export const tripRoute = (id: string) => `/trips/${id}` as const
export const tripEditRoute = (id: string) => `/trips/${id}/edit` as const
export const tripNewMemoryRoute = (id: string) => `/trips/${id}/memories/new` as const
export const tripKeepsakesRoute = (id: string) => `/trips/${id}/keepsakes` as const
export const memoryRoute = (tripId: string, memoryId: string) =>
  `/trips/${tripId}/memories/${memoryId}` as const
export const memoryEditRoute = (tripId: string, memoryId: string) =>
  `/trips/${tripId}/memories/${memoryId}/edit` as const

export const publicPortfolioRoute = (username: string) => `/u/${username}` as const
export const publicTripRoute = (username: string, tripId: string) =>
  `/u/${username}/trips/${tripId}` as const
