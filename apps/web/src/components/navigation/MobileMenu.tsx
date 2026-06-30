'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useClerk } from '@clerk/nextjs'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@passe/ui'
import { buttonVariants } from '@passe/ui/button'
import { Separator } from '@passe/ui/separator'
import { cn } from '@passe/utils'
import { Link, useRouter } from '@/i18n/navigation'
import { routes, publicPortfolioRoute } from '@/lib/routes'
import { LocaleDropdownMenu } from '@/components/shared/LocaleDropdownMenu'
import { ThemeDropdownMenu } from '@/components/shared/ThemeDropdownMenu'
import { LogoutButton } from '@/features/auth/components/LogoutButton'

interface MobileMenuProps {
  username: string | null
  displayName: string
  email: string
  avatarUrl: string | null
}

export function MobileMenu({ username, displayName, email, avatarUrl }: MobileMenuProps) {
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
    signOut(() => router.push(routes.signIn))
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
            <div className="flex flex-1 flex-col gap-4 justify-start items-center overflow-y-auto p-24">
              <Link
                href={routes.dashboard}
                onClick={close}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'w-full justify-center uppercase text-xl',
                )}
              >
                Dashboard
              </Link>
              {username && (
                <a
                  href={publicPortfolioRoute(username)}
                  onClick={close}
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'sm' }),
                    'w-full justify-start',
                  )}
                >
                  My Portfolio
                </a>
              )}

              <Separator />

              <div className="flex flex-col items-center gap-2 w-full my-2">
                <div className="flex items-center justify-center w-full  flex-col gap-2">
                  <span className="text-base text-muted-foreground">Locale</span>
                  <LocaleDropdownMenu className="w-full" />
                </div>

                <div className="flex items-center justify-center w-full  flex-col gap-2">
                  <span className="text-base text-muted-foreground">Theme</span>
                  <ThemeDropdownMenu className="w-full" />
                </div>
              </div>

              <Separator />

              <LogoutButton className="w-full" />
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
