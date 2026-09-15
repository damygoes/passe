import { LocaleDropdownMenu } from '@/components/shared/LocaleDropdownMenu'
import { ThemeDropdownMenu } from '@/components/shared/ThemeDropdownMenu'
import { Link } from '@/i18n/navigation'
import { routes } from '@/lib/routes'
import { buttonVariants } from '@passe/ui/button'
import { Logo } from '@passe/ui/logo'
import { Navbar, NavbarBrand, NavbarUser } from '@passe/ui/navbar'
import { getTranslations } from 'next-intl/server'
import { ExitLink } from './ExitLink'

const ANCHOR_LINKS = [
  { key: 'how', href: '#how' },
  { key: 'what_you_keep', href: '#keep' },
  { key: 'plans', href: '#plans' },
] as const

export async function LandingHeader() {
  const t = await getTranslations('landing.nav')

  return (
    <Navbar className="border-b-[color:var(--color-divider)] bg-background/88 px-6 backdrop-blur-md">
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

      <nav className="hidden items-center gap-6 font-mono text-[13px] text-muted-foreground md:flex">
        {ANCHOR_LINKS.map(({ key, href }) => (
          <a key={key} href={href} className="transition-colors hover:text-foreground">
            {t(key)}
          </a>
        ))}
      </nav>

      <NavbarUser className="gap-2 sm:gap-3">
        <LocaleDropdownMenu className="h-8 px-2.5 text-xs" />
        <ThemeDropdownMenu className="size-8" />
        <ExitLink
          href={routes.signIn}
          className={buttonVariants({
            variant: 'ghost',
            size: 'sm',
            className: 'hidden sm:inline-flex',
          })}
        >
          {t('sign_in')}
        </ExitLink>
        <ExitLink href={routes.signUp} className={buttonVariants({ size: 'sm' })}>
          {t('get_started')}
        </ExitLink>
      </NavbarUser>
    </Navbar>
  )
}
