import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

// Link and useRouter/usePathname are locale-aware client-side helpers.
// For server-side redirects, use Next.js redirect() with /${locale}${path} directly,
// since next-intl v4's server redirect requires explicit { href, locale } object.
export const { Link, usePathname, useRouter } = createNavigation(routing)
