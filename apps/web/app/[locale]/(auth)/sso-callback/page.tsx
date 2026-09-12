import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'
import { Icon } from '@passe/ui/icon'
import { getTranslations } from 'next-intl/server'

export default async function SSOCallbackPage() {
  const t = await getTranslations('auth.sso_callback')

  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <AuthenticateWithRedirectCallback />
      <span className="animate-spin text-terracotta">
        <Icon name="loading" size="2xl" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-semibold text-foreground">{t('heading')}</h1>
        <p className="text-sm text-muted-foreground">{t('subheading')}</p>
      </div>
      <div id="clerk-captcha" />
    </div>
  )
}
