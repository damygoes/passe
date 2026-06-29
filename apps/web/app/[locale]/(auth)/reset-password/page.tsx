import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm'

export default async function ResetPasswordPage() {
  const t = await getTranslations('auth.reset_password')

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">{t('heading')}</h1>
        <p className="text-sm text-muted-foreground">{t('subheading')}</p>
      </div>

      <ResetPasswordForm />

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/forgot-password"
          className="font-medium text-primary transition-opacity hover:opacity-70"
        >
          {t('resend_link')}
        </Link>
      </p>
    </div>
  )
}
