'use client'

import * as React from 'react'

import { Link } from '@/i18n/navigation'
import { routes } from '@/lib/routes'
import { Logo } from '@passe/ui/logo'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@passe/ui/sidebar'
import { NavUser } from './NavUser'
import { SidebarNav } from './SidebarNav'

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  displayName: string
  email: string
  avatarUrl: string | null
  username: string | null
}

export function AppSidebar({ displayName, email, avatarUrl, username, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <Link
          href={routes.dashboard}
          aria-label="Passe"
          className="flex items-center px-2 py-1 text-foreground transition-opacity hover:opacity-80"
        >
          <Logo className="h-12 w-auto" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav username={username} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser displayName={displayName} email={email} avatarUrl={avatarUrl} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
