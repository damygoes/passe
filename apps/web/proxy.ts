import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { PUBLIC_ROUTES } from '@passe/auth/constants'

const isPublicRoute = createRouteMatcher([...PUBLIC_ROUTES])

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth.protect()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/(.*)',
  ],
}
