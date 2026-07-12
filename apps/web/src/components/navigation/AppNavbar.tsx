import { buttonVariants } from '@passe/ui/button'
import { Logo } from '@passe/ui/logo'
import { Navbar, NavbarBrand, NavbarLinks } from '@passe/ui/navbar'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { routes } from '@/lib/routes'
import { LocaleDropdownMenu } from '@/components/shared/LocaleDropdownMenu'
import { ThemeDropdownMenu } from '@/components/shared/ThemeDropdownMenu'
import { MobileMenu } from './MobileMenu'
import { NavbarUserMenu } from './NavbarUserMenu'
import { PortfolioLink } from './PortfolioLink'

interface AppNavbarProps {
  displayName: string
  email: string
  avatarUrl: string | null
  username: string | null
}

export async function AppNavbar({ displayName, email, avatarUrl, username }: AppNavbarProps) {
  const t = await getTranslations('nav')

  return (
    <Navbar>
      <NavbarBrand>
        <Link
          href={routes.dashboard}
          className="text-foreground hover:opacity-80 transition-opacity"
          aria-label="Passé"
        >
          <Logo className="h-7 w-auto" />
        </Link>
      </NavbarBrand>

      {/* Desktop nav links */}
      <NavbarLinks className="hidden md:flex">
        <Link href={routes.dashboard} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
          {t('dashboard')}
        </Link>
        <Link href={routes.map} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
          {t('map')}
        </Link>
        <PortfolioLink username={username} />
      </NavbarLinks>

      {/* Desktop user section */}
      <div className="ml-auto shrink-0 items-center hidden md:flex gap-4">
        <div className="flex justify-center items-center gap-4">
          <LocaleDropdownMenu />
          <ThemeDropdownMenu />
        </div>
        <NavbarUserMenu displayName={displayName} email={email} avatarUrl={avatarUrl} />
      </div>

      {/* Mobile menu — manages its own hamburger button + dropdown panel */}
      <MobileMenu username={username} />
    </Navbar>
  )
}
