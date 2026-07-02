import { buttonVariants } from '@passe/ui/button'
import { Navbar, NavbarBrand, NavbarUser } from '@passe/ui/navbar'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { routes } from '@/lib/routes'
import { LocaleDropdownMenu } from '@/components/shared/LocaleDropdownMenu'
import { ThemeDropdownMenu } from '@/components/shared/ThemeDropdownMenu'

export async function LandingHeader() {
  const t = await getTranslations('landing.nav')

  return (
    <Navbar className="border-border/40 bg-background/70 px-6 backdrop-blur-md">
      <NavbarBrand>
        <Link
          href={routes.home}
          className="font-display text-2xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-80"
        >
          Passé.
        </Link>
      </NavbarBrand>

      <NavbarUser className="gap-2 sm:gap-3">
        <LocaleDropdownMenu className="h-8 px-2.5 text-xs" />
        <ThemeDropdownMenu className="size-8" />
        <Link
          href={routes.signIn}
          className={buttonVariants({
            variant: 'ghost',
            size: 'sm',
            className: 'hidden sm:inline-flex',
          })}
        >
          {t('sign_in')}
        </Link>
        <Link href={routes.signUp} className={buttonVariants({ size: 'sm' })}>
          {t('get_started')}
        </Link>
      </NavbarUser>
    </Navbar>
  )
}
