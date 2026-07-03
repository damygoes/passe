import { AccountFormLayout } from '@/features/account/components/AccountFormLayout'
import { PasswordForm } from '@/features/account/components/PasswordForm'

export function SecurityScreen() {
  return (
    <AccountFormLayout>
      <PasswordForm />
    </AccountFormLayout>
  )
}
