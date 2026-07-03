import { AccountFormLayout } from '@/features/account/components/AccountFormLayout'
import { PasswordForm } from '@/features/account/components/PasswordForm'
import { useTranslations } from '@/i18n/useTranslations'

export function SecurityScreen() {
  const tTabs = useTranslations('account.tabs')

  return (
    <AccountFormLayout title={tTabs('security')}>
      <PasswordForm />
    </AccountFormLayout>
  )
}
