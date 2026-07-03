import { useUser as useClerkUser } from '@clerk/expo'
import { useUser } from '@passe/hooks'

import { AccountFormLayout } from '@/features/account/components/AccountFormLayout'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { ProfileForm } from '@/features/account/components/ProfileForm'
import { ProfileFormSkeleton } from '@/features/account/components/ProfileFormSkeleton'
import { useTranslations } from '@/i18n/useTranslations'

export function ProfileScreen() {
  const t = useTranslations('account.profile')
  const tTabs = useTranslations('account.tabs')
  const tErrors = useTranslations('account.errors')
  const { data: user, isLoading, isError } = useUser()
  const { user: clerkUser } = useClerkUser()

  const email = clerkUser?.primaryEmailAddress?.emailAddress ?? ''

  return (
    <AccountFormLayout title={tTabs('profile')} description={t('description')}>
      {isLoading ? (
        <ProfileFormSkeleton />
      ) : isError || !user ? (
        <ErrorBanner message={tErrors('load_failed')} />
      ) : (
        <ProfileForm
          displayName={user.displayName}
          username={user.username}
          bio={user.bio ?? null}
          email={email}
        />
      )}
    </AccountFormLayout>
  )
}
