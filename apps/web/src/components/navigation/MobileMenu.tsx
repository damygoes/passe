'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useClerk } from '@clerk/nextjs'
import { Avatar, AvatarFallback, AvatarImage, Button } from '@passe/ui'
import { buttonVariants } from '@passe/ui/button'
import { Separator } from '@passe/ui/separator'
import { cn } from '@passe/utils'
import { SIGN_IN_URL } from '@passe/auth/constants'
import { useRouter } from '@/i18n/navigation'
import { LocaleDropdownMenu } from '@/components/shared/LocaleDropdownMenu'
import { ThemeDropdownMenu } from '@/components/shared/ThemeDropdownMenu'
import { LogoutButton } from '@/features/auth/components/LogoutButton'

interface MobileMenuProps {
  locale: string
  username: string | null
  displayName: string
  email: string
  avatarUrl: string | null
}

type MobileMenuUserInfo = Pick<MobileMenuProps, 'avatarUrl' | 'displayName' | 'email'>

function UserInfo({ avatarUrl, displayName, email }: MobileMenuUserInfo) {
  const initials = displayName
    .split(' ')
    .map((part) => part[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
      <Avatar size="sm">
        {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <span className="grid min-w-0 flex-1 leading-tight">
        <span className="truncate text-sm font-medium">{displayName}</span>
        <span className="truncate text-xs text-muted-foreground">{email}</span>
      </span>
    </div>
  )
}

export function MobileMenu({ locale, username, displayName, email, avatarUrl }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { signOut } = useClerk()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const close = () => setIsOpen(false)

  const handleSignOut = () => {
    close()
    signOut(() => router.push(SIGN_IN_URL))
  }

  return (
    <>
      {/* Hamburger toggle — visible on mobile only */}
      <Button
        variant="ghost"
        size="icon-sm"
        icon="menu"
        className="ml-auto md:hidden"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      />

      {/* Full-screen overlay — portalled to document.body to escape navbar's backdrop-blur containing block */}
      {mounted &&
        createPortal(
          <div
            className={cn(
              'fixed inset-0 z-50 flex flex-col bg-background transition-all duration-300 ease-in-out',
              isOpen
                ? 'translate-x-0 opacity-100'
                : 'translate-x-full opacity-0 pointer-events-none',
            )}
          >
            {/* Overlay header — mirrors the navbar height */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b px-4">
              <span className="font-display text-3xl font-bold tracking-tight">Passé.</span>
              <Button
                variant="ghost"
                size="icon-sm"
                icon="close"
                onClick={close}
                aria-label="Close menu"
              />
            </div>

            {/* Scrollable content */}
            <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4">
              <Link
                href={`/${locale}/dashboard`}
                onClick={close}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'w-full justify-start',
                )}
              >
                Dashboard
              </Link>
              {username && (
                <a
                  href={`/public/${username}`}
                  onClick={close}
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'sm' }),
                    'w-full justify-start',
                  )}
                >
                  My Portfolio
                </a>
              )}

              <Separator className="my-2" />

              <div className="flex flex-col items-center gap-2 px-1">
                <div className="flex flex-col w-full">
                  <span className="text-xs text-muted-foreground">Locale</span>
                  <LocaleDropdownMenu />
                </div>
                <div className="flex flex-col w-full">
                  <span className="ml-auto text-xs text-muted-foreground">Theme</span>
                  <ThemeDropdownMenu />
                </div>
              </div>

              <Separator className="my-2" />

              <UserInfo displayName={displayName} email={email} avatarUrl={avatarUrl} />

              <LogoutButton />
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
