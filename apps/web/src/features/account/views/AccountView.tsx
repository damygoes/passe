'use client'

import { useUser as useClerkUser } from '@clerk/nextjs'
import { useUser } from '@passe/hooks'
import { Separator } from '@passe/ui/separator'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { AccountSidebar, type AccountTab } from '../components/AccountSidebar'
import { AccountViewError } from '../components/AccountViewError'
import { AccountViewSkeleton } from '../components/AccountViewSkeleton'
import { DangerZone } from '../components/DangerZone'
import { PasswordForm } from '../components/PasswordForm'
import { ProfileForm } from '../components/ProfileForm'

export function AccountView() {
  const t = useTranslations('account')
  const { data: user, isLoading, isError } = useUser()
  const { user: clerkUser } = useClerkUser()
  const [activeTab, setActiveTab] = useState<AccountTab>('profile')

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
    <div className="container max-w-4xl mx-auto py-8 px-4 md:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>

      <Separator className="my-6" />

      <div className="flex flex-col md:flex-row gap-8">
        <AccountSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 min-w-0">
          <div key={activeTab} className="animate-in fade-in-0 slide-in-from-left-1 duration-200">
            {content[activeTab]}
          </div>
        </div>
      </div>
    </div>
  )
}
