import { buttonVariants } from '@passe/ui/button'
import { Icon } from '@passe/ui/icon'
import { cn } from '@passe/utils'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { routes } from '@/lib/routes'
import { Reveal } from '@/components/shared/Reveal'

export async function FinalCtaSection() {
  const t = await getTranslations('landing.cta')

  return (
    <section className="px-6 pb-24 md:pb-32">
      <Reveal className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-terracotta to-terracotta-dark px-8 py-16 text-center text-aged-cream">
          <Icon
            name="sparkles"
            size="2xl"
            aria-hidden
            className="animate-float absolute top-8 right-10 opacity-30"
          />
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance md:text-5xl">
            {t('heading')}
          </h2>
          <p className="mt-4 text-aged-cream/80">{t('subtitle')}</p>
          <Link
            href={routes.signUp}
            className={cn(
              buttonVariants({ size: 'lg' }),
              'mt-10 bg-aged-cream text-dark-espresso transition-shadow hover:bg-warm-white hover:shadow-lg',
            )}
          >
            {t('button')}
            <Icon name="arrow-right" size="sm" aria-hidden />
          </Link>
        </div>
      </Reveal>
    </section>
  )
}
