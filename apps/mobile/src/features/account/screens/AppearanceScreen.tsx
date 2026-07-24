import { useUser } from '@passe/hooks'

import { AccountFormLayout } from '@/features/account/components/AccountFormLayout'
import { AppearanceForm } from '@/features/account/components/AppearanceForm'
import { AppearanceFormSkeleton } from '@/features/account/components/AppearanceFormSkeleton'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { useTranslations } from '@/i18n/useTranslations'

export function AppearanceScreen() {
  const t = useTranslations('account.appearance')
  const tTabs = useTranslations('account.tabs')
  const tErrors = useTranslations('account.errors')
  const { data: user, isLoading, isError } = useUser()

  return (
    <AccountFormLayout title={tTabs('appearance')} description={t('description')}>
      {isLoading ? (
        <AppearanceFormSkeleton />
      ) : isError || !user ? (
        <ErrorBanner message={tErrors('load_failed')} />
      ) : (
        <AppearanceForm theme={user.theme} plan={user.plan} />
      )}
    </AccountFormLayout>
  )
}
