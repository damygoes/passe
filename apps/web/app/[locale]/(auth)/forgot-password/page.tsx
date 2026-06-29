import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'

export default async function ForgotPasswordPage() {
  const t = await getTranslations('auth.forgot_password')

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">{t('heading')}</h1>
        <p className="text-sm text-muted-foreground">{t('subheading')}</p>
      </div>

      <ForgotPasswordForm />

      <p className="text-center text-sm text-muted-foreground">
        {t('remembered')}{' '}
        <Link href="/sign-in" className="font-medium text-primary transition-opacity hover:opacity-70">
          {t('back_to_sign_in')}
        </Link>
      </p>
    </div>
  )
}
