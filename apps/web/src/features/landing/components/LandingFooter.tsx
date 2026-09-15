import { Logo } from '@passe/ui/logo'
import { getTranslations } from 'next-intl/server'
import { routes } from '@/lib/routes'
import { UnderlineLink } from './UnderlineLink'

export async function LandingFooter() {
  const t = await getTranslations('landing.footer')
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[color:var(--color-divider)] px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <Logo className="h-6 w-auto" />
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13.5px] text-muted-foreground">
          <UnderlineLink href="#keep" className="hover:text-foreground">
            {t('what_you_keep')}
          </UnderlineLink>
          <UnderlineLink href="#plans" className="hover:text-foreground">
            {t('plans')}
          </UnderlineLink>
          <UnderlineLink href="#how" className="hover:text-foreground">
            {t('how_it_works')}
          </UnderlineLink>
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
          <UnderlineLink href={routes.signIn} className="hover:text-foreground">
            {t('sign_in')}
          </UnderlineLink>
          <UnderlineLink href={routes.signUp} className="hover:text-foreground">
            {t('sign_up')}
          </UnderlineLink>
        </nav>
      </div>
      <p className="mt-6 text-center font-mono text-xs text-muted-foreground">
        {t('copyright', { year })}
      </p>
    </footer>
  )
}
