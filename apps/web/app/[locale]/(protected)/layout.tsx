import { currentUser } from '@clerk/nextjs/server'
import { AppNavbar } from '@/components/navigation/AppNavbar'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export default async function ProtectedLayout({ children, params }: Props) {
  const { locale } = await params
  const user = await currentUser()

  const email =
    user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? ''

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavbar
        locale={locale}
        displayName={user?.fullName ?? user?.username ?? 'User'}
        email={email}
        avatarUrl={user?.hasImage ? (user.imageUrl ?? null) : null}
        username={user?.username ?? null}
      />
      <main className="flex-1">{children}</main>
    </div>
  )
}
