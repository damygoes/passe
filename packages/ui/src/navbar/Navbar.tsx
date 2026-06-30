import { cn } from '@passe/utils'
import * as React from 'react'

function Navbar({ className, ...props }: React.ComponentProps<'header'>) {
  return (
    <header
      data-slot="navbar"
      className={cn(
        'sticky top-0 z-50 flex h-16 w-full items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm',
        className,
      )}
      {...props}
    />
  )
}

function NavbarBrand({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="navbar-brand"
      className={cn('flex shrink-0 items-center gap-2', className)}
      {...props}
    />
  )
}

function NavbarLinks({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      data-slot="navbar-links"
      className={cn('flex items-center gap-1', className)}
      {...props}
    />
  )
}

function NavbarUser({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="navbar-user"
      className={cn('ml-auto flex shrink-0 items-center gap-2', className)}
      {...props}
    />
  )
}

export { Navbar, NavbarBrand, NavbarLinks, NavbarUser }
