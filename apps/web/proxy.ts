import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { PUBLIC_ROUTES } from '@passe/auth/constants'
import { LOCALES, DEFAULT_LOCALE } from '@passe/i18n'

const handleI18nRouting = createIntlMiddleware(routing)
const isPublicRoute = createRouteMatcher([...PUBLIC_ROUTES])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    // Extract locale from the URL path so the sign-in redirect preserves it.
    // e.g. /en/dashboard → locale "en" → redirect to /en/sign-in
    const [, potentialLocale = ''] = req.nextUrl.pathname.split('/')
    const locale = (LOCALES as readonly string[]).includes(potentialLocale)
      ? potentialLocale
      : DEFAULT_LOCALE
    await auth.protect({ unauthenticatedUrl: new URL(`/${locale}/sign-in`, req.nextUrl.origin).toString() })
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
