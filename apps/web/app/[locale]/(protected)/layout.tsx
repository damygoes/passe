import { currentUser } from '@clerk/nextjs/server'
import { MotionProvider } from '@/components/motion/MotionProvider'
import { AppNavbar } from '@/components/navigation/AppNavbar'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default async function ProtectedLayout({ children }: Props) {
  const user = await currentUser()

  const email =
    user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? ''

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavbar
        displayName={user?.fullName ?? user?.username ?? 'User'}
        email={email}
        avatarUrl={user?.hasImage ? (user.imageUrl ?? null) : null}
        username={user?.username ?? null}
      />
      <main className="flex-1">
        <MotionProvider>{children}</MotionProvider>
      </main>
    </div>
  )
}
