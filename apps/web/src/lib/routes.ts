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
