import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createIntlMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'
import { PUBLIC_ROUTES } from '@passe/auth/constants'
import { LOCALES, DEFAULT_LOCALE } from '@passe/i18n'
import { routes } from '@/lib/routes'

const handleI18nRouting = createIntlMiddleware(routing)
const isPublicRoute = createRouteMatcher([...PUBLIC_ROUTES])
const isAuthRoute = createRouteMatcher([
  '/:locale/sign-in(.*)',
  '/:locale/sign-up(.*)',
  '/:locale/forgot-password(.*)',
  '/:locale/reset-password(.*)',
  '/:locale/sso-callback(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // API routes and public portfolio routes are outside the [locale] segment —
  // skip i18n routing entirely so the locale prefix is never prepended.
  if (req.nextUrl.pathname.startsWith('/api/')) return
  if (req.nextUrl.pathname.startsWith('/u/')) return

  // Extract locale from the URL path so redirects preserve it.
  // e.g. /en/dashboard → locale "en"
  const [, potentialLocale = ''] = req.nextUrl.pathname.split('/')
  const locale = (LOCALES as readonly string[]).includes(potentialLocale)
    ? potentialLocale
    : DEFAULT_LOCALE

  const { userId } = await auth()

  // Authenticated users hitting auth pages (sign-in, sign-up, etc.) get bounced
  // to dashboard so they can't get stuck on a "You're already signed in" screen.
  if (isAuthRoute(req) && userId) {
    return NextResponse.redirect(new URL(`/${locale}${routes.dashboard}`, req.nextUrl.origin))
  }

  if (!isPublicRoute(req)) {
    await auth.protect({ unauthenticatedUrl: new URL(`/${locale}${routes.signIn}`, req.nextUrl.origin).toString() })
  }

  return handleI18nRouting(req)
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/(.*)',
  ],
}
