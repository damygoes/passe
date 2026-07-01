'use client'

import { useUser as useClerkUser } from '@clerk/nextjs'
import { useUser } from '@passe/hooks'
import { type AccountTab } from '../components/AccountSidebar'
import { AccountViewError } from '../components/AccountViewError'
import { AccountViewSkeleton } from '../components/AccountViewSkeleton'
import { DangerZone } from '../components/DangerZone'
import { PasswordForm } from '../components/PasswordForm'
import { ProfileForm } from '../components/ProfileForm'

export function AccountTabViewDataWrapper({ activeTab }: { activeTab: AccountTab }) {
  const { data: user, isLoading, isError } = useUser()
  const { user: clerkUser } = useClerkUser()

  const email = clerkUser?.primaryEmailAddress?.emailAddress ?? ''

  if (isLoading) return <AccountViewSkeleton />
  if (isError || !user) return <AccountViewError />

  const content: Record<AccountTab, React.ReactNode> = {
    profile: (
      <ProfileForm
        displayName={user.displayName}
        username={user.username}
        bio={user.bio ?? null}
        email={email}
      />
    ),
    security: <PasswordForm />,
    danger: <DangerZone />,
  }

  return (
    <div key={activeTab} className="animate-in fade-in-0 slide-in-from-left-1 duration-200">
      {content[activeTab]}
    </div>
  )
}
