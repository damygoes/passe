import { LocaleDropdownMenu } from '@/components/shared/LocaleDropdownMenu'
import { ThemeDropdownMenu } from '@/components/shared/ThemeDropdownMenu'
import { Link } from '@/i18n/navigation'
import { routes } from '@/lib/routes'
import { buttonVariants } from '@passe/ui/button'
import { Logo } from '@passe/ui/logo'
import { Navbar, NavbarBrand, NavbarUser } from '@passe/ui/navbar'
import { cn } from '@passe/utils'
import { getTranslations } from 'next-intl/server'
import { ANCHOR_LINKS } from '../constants'
import { ExitLink } from './ExitLink'
import { LandingNavMenu } from './LandingNavMenu'

export async function LandingHeader() {
  const t = await getTranslations('landing.nav')

  return (
    <Navbar className="border-b-[color:var(--color-divider)] bg-background/88 px-4 backdrop-blur-md sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:radial-gradient(64rem_16rem_at_5%_0%,#c4622d,transparent)]"
      >
        <div className="absolute -top-50 -left-20 size-[30rem] rounded-full bg-terracotta/15 blur-3xl" />
      </div>

      <NavbarBrand>
        <Link
          href={routes.home}
          className="text-foreground transition-opacity hover:opacity-80"
          aria-label="Passe"
        >
          <Logo className="h-6 w-auto" />
        </Link>
      </NavbarBrand>

      <nav className="hidden items-center gap-6 font-mono text-[13px] text-muted-foreground lg:flex">
        {ANCHOR_LINKS.map(({ key, href }) => (
          <a key={key} href={href} className="transition-colors hover:text-foreground">
            {t(key)}
          </a>
        ))}
      </nav>

      {/* Below lg everything except the logo and the primary CTA moves into LandingNavMenu —
          the full row is 426px wide in English and 501px in German, so it cannot fit a phone. */}
      <NavbarUser className="gap-2 sm:gap-3">
        <LocaleDropdownMenu className="hidden h-8 px-2.5 text-xs lg:inline-flex" />
        <ThemeDropdownMenu className="hidden size-8 lg:inline-flex" />
        <ExitLink
          href={routes.signIn}
          // cn(), not buttonVariants' own className: cva concatenates, so `hidden` would
          // sit alongside the base `inline-flex` and lose on stylesheet order. twMerge
          // drops the conflicting one and keeps the lg: modifier.
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'hidden lg:inline-flex')}
        >
          {t('sign_in')}
        </ExitLink>
        <ExitLink href={routes.signUp} className={buttonVariants({ size: 'sm' })}>
          {/* "Starte dein Reisetagebuch" is 183px — too wide for a phone bar, and it has no
              sensible truncation point, so mobile gets its own shorter label. */}
          <span className="lg:hidden">{t('get_started_short')}</span>
          <span className="hidden lg:inline">{t('get_started')}</span>
        </ExitLink>
        <LandingNavMenu className="lg:hidden" />
      </NavbarUser>
    </Navbar>
  )
}
