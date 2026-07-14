import { Link } from '@/i18n/navigation'
import { routes } from '@/lib/routes'
import { Badge } from '@passe/ui/badge'
import { buttonVariants } from '@passe/ui/button'
import { Icon } from '@passe/ui/icon'
import { getTranslations } from 'next-intl/server'

const MARQUEE_PLACES = [
  'Kyoto',
  'Lisboa',
  'Marrakesh',
  'Oaxaca',
  'Reykjavík',
  'Hà Nội',
  'Valparaíso',
  'Zanzibar',
  'Santorini',
  'Kathmandu',
]

export async function HeroSection() {
  const t = await getTranslations('landing.hero')

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden">
      {/* Ambient background */}
      <div
        aria-hidden
        className="animate-drift absolute -right-32 -bottom-16 size-[36rem] rounded-full bg-deep-olive/10 blur-3xl [animation-delay:-10s]"
      />

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <Badge variant="secondary" className="animate-fade-up mb-6 [animation-delay:100ms]">
          <Icon name="sparkles" size="xs" aria-hidden />
          {t('eyebrow')}
        </Badge>

        <h1 className="animate-fade-up font-display max-w-3xl text-5xl font-bold tracking-tight text-balance [animation-delay:200ms] md:text-7xl">
          {t('title_leading')} <em className="text-primary italic">{t('title_accent')}</em>
        </h1>

        <p className="animate-fade-up mt-6 max-w-xl text-lg text-muted-foreground [animation-delay:300ms]">
          {t('subtitle')}
        </p>

        <div className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-3 [animation-delay:400ms]">
          <Link
            href={routes.signUp}
            className={buttonVariants({
              size: 'lg',
              className: 'transition-shadow hover:shadow-lg',
            })}
          >
            {t('cta_primary')}
            <Icon name="arrow-right" size="sm" aria-hidden />
          </Link>
          <Link href={routes.signIn} className={buttonVariants({ variant: 'outline', size: 'lg' })}>
            {t('cta_secondary')}
          </Link>
        </div>

        <p className="animate-fade-up mt-6 text-xs text-muted-foreground [animation-delay:400ms]">
          {t('note')}
        </p>
      </div>

      {/* Place-name marquee — decorative */}
      <div
        aria-hidden
        className="relative pb-10 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
      >
        <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
          {[...MARQUEE_PLACES, ...MARQUEE_PLACES].map((place, i) => (
            <span key={i} className="font-display text-2xl text-muted-foreground/40 italic">
              {place} ·
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
