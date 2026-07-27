import { Logo } from '@passe/ui/logo'
import { getTranslations } from 'next-intl/server'
import { routes } from '@/lib/routes'
import { UnderlineLink } from './UnderlineLink'

export async function LandingFooter() {
  const t = await getTranslations('landing.footer')
  const tCommon = await getTranslations('common')
  const year = new Date().getFullYear()

  return (
    <footer className="border-t px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <Logo className="mx-auto h-5 w-auto sm:mx-0" />
          <p className="mt-1 text-sm text-muted-foreground">{tCommon('app_tagline')}</p>
        </div>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <UnderlineLink href={routes.signIn} className="hover:text-foreground">
            {t('sign_in')}
          </UnderlineLink>
          <UnderlineLink href={routes.signUp} className="hover:text-foreground">
            {t('sign_up')}
          </UnderlineLink>
        </nav>
      </div>
      <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
        <UnderlineLink href={routes.privacyPolicy} className="hover:text-foreground">
          {t('privacy_policy')}
        </UnderlineLink>
        <UnderlineLink href={routes.termsOfService} className="hover:text-foreground">
          {t('terms_of_service')}
        </UnderlineLink>
        <UnderlineLink href={routes.impressum} className="hover:text-foreground">
          {t('impressum')}
        </UnderlineLink>
        <UnderlineLink href={routes.support} className="hover:text-foreground">
          {t('support')}
        </UnderlineLink>
      </nav>
      <p className="mt-6 text-center text-xs text-muted-foreground">{t('copyright', { year })}</p>
    </footer>
  )
}
