export const routes = {
  home: '/',
  dashboard: '/dashboard',
  signIn: '/sign-in',
  signUp: '/sign-up',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  ssoCallback: '/sso-callback',
  tripsNew: '/trips/new',
  account: '/account',
  billing: '/billing',
} as const

export const tripRoute = (id: string) => `/trips/${id}` as const
export const tripEditRoute = (id: string) => `/trips/${id}/edit` as const
export const tripNewMemoryRoute = (id: string) => `/trips/${id}/memories/new` as const

export const publicPortfolioRoute = (username: string) => `/u/${username}` as const
export const publicTripRoute = (username: string, tripId: string) =>
  `/u/${username}/trips/${tripId}` as const
