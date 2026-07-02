import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { routes } from '@/lib/routes'

export async function LandingFooter() {
  const t = await getTranslations('landing.footer')
  const tCommon = await getTranslations('common')
  const year = new Date().getFullYear()

  return (
    <footer className="border-t px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <p className="font-display text-lg font-bold tracking-tight">Passé.</p>
          <p className="mt-1 text-sm text-muted-foreground">{tCommon('app_tagline')}</p>
        </div>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href={routes.signIn} className="transition-colors hover:text-foreground">
            {t('sign_in')}
          </Link>
          <Link href={routes.signUp} className="transition-colors hover:text-foreground">
            {t('sign_up')}
          </Link>
        </nav>
      </div>
      <p className="mt-8 text-center text-xs text-muted-foreground">{t('copyright', { year })}</p>
    </footer>
  )
}
