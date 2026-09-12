import { MotionProvider } from '@/components/motion/MotionProvider'
import { AppSidebar } from '@/components/navigation/AppSidebar'
import { SiteHeader } from '@/components/navigation/SiteHeader'
import { currentUser } from '@clerk/nextjs/server'
import { SidebarInset, SidebarProvider } from '@passe/ui'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default async function ProtectedLayout({ children }: Props) {
  const user = await currentUser()

  const email =
    user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? ''

  return (
    <SidebarProvider
      style={
        {
          // 244px, per the redesign's sidebar spec.
          '--sidebar-width': 'calc(var(--spacing) * 61)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        displayName={user?.fullName ?? user?.username ?? 'User'}
        email={email}
        avatarUrl={user?.hasImage ? (user.imageUrl ?? null) : null}
        username={user?.username ?? null}
      />
      <SidebarInset>
        <SiteHeader />
        <main className="flex-1">
          <MotionProvider>{children}</MotionProvider>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
