import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Separator } from '@passe/ui/separator'
import { SignInForm } from '@/components/auth/SignInForm'
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons'

export default async function SignInPage() {
  const t = await getTranslations('auth.sign_in')

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">{t('heading')}</h1>
        <p className="text-sm text-muted-foreground">{t('subheading')}</p>
      </div>

      <SocialAuthButtons mode="sign-in" />

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">{t('or_email')}</span>
        <Separator className="flex-1" />
      </div>

      <SignInForm />

      <p className="text-center text-sm text-muted-foreground">
        {t('no_account')}{' '}
        <Link href="/sign-up" className="font-medium text-primary transition-opacity hover:opacity-70">
          {t('sign_up_link')}
        </Link>
      </p>
    </div>
  )
}
