// Web route constants — used in proxy.ts and ClerkProvider props
// Do NOT use these for mobile navigation (deep links differ from web routes)
export const SIGN_IN_URL = '/sign-in'
export const SIGN_UP_URL = '/sign-up'
export const AFTER_SIGN_IN_URL = '/dashboard'
export const AFTER_SIGN_UP_URL = '/dashboard'

// Public routes passed to createRouteMatcher in proxy.ts
export const PUBLIC_ROUTES = [
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/p/(.*)', // public portfolios
] as const
