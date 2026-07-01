export const routes = {
  home: '/',
  dashboard: '/dashboard',
  signIn: '/sign-in',
  signUp: '/sign-up',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  ssoCallback: '/sso-callback',
  tripsNew: '/trips/new',
} as const

export const tripRoute = (id: string) => `/trips/${id}` as const

export const publicPortfolioRoute = (username: string) => `/u/${username}` as const
