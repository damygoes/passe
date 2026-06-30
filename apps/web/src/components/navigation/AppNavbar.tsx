import Link from 'next/link'
import { buttonVariants } from '@passe/ui/button'
import { Navbar, NavbarBrand, NavbarLinks, NavbarUser } from '@passe/ui/navbar'
import { LocaleDropdownMenu } from '@/components/shared/LocaleDropdownMenu'
import { ThemeDropdownMenu } from '@/components/shared/ThemeDropdownMenu'
import { MobileMenu } from './MobileMenu'
import { NavbarUserMenu } from './NavbarUserMenu'

interface AppNavbarProps {
  locale: string
  displayName: string
  email: string
  avatarUrl: string | null
  username: string | null
}

export function AppNavbar({ locale, displayName, email, avatarUrl, username }: AppNavbarProps) {
  return (
    <Navbar>
      <NavbarBrand>
        <Link
          href={`/${locale}/dashboard`}
          className="font-display text-3xl font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity"
        >
          Passé.
        </Link>
      </NavbarBrand>

      {/* Desktop nav links */}
      <NavbarLinks className="hidden md:flex">
        <Link
          href={`/${locale}/dashboard`}
          className={buttonVariants({ variant: 'ghost', size: 'sm' })}
        >
          Dashboard
        </Link>
        {username && (
          <a
            href={`/public/${username}`}
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            My Portfolio
          </a>
        )}
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
      <MobileMenu
        locale={locale}
        username={username}
        displayName={displayName}
        email={email}
        avatarUrl={avatarUrl}
      />
    </Navbar>
  )
}
