import { Link } from '@/i18n/navigation'
import { routes } from '@/lib/routes'
import { Badge } from '@passe/ui/badge'
import { buttonVariants } from '@passe/ui/button'
import { Icon } from '@passe/ui/icon'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { HERO_PHOTO } from '../constants'
import { PostmarkBadge } from './PostmarkBadge'

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

      <div className="relative flex flex-1 items-center px-6 py-24">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Badge variant="secondary" className="animate-fade-up mb-6 [animation-delay:100ms]">
              <Icon name="sparkles" size="xs" aria-hidden />
              {t('eyebrow')}
            </Badge>

            <h1 className="animate-fade-up font-display max-w-xl text-5xl font-bold tracking-tight text-balance [animation-delay:200ms] md:text-6xl">
              {t('title_leading')} <em className="text-primary italic">{t('title_accent')}</em>
            </h1>

            <p className="animate-fade-up mt-6 max-w-xl text-lg text-muted-foreground [animation-delay:300ms]">
              {t('subtitle')}
            </p>

            <div className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-3 [animation-delay:400ms] md:justify-start">
              <Link
                href={routes.signUp}
                className={buttonVariants({
                  size: 'lg',
                  className: 'transition-all hover:-translate-y-0.5 hover:shadow-lg',
                })}
              >
                {t('cta_primary')}
                <Icon name="arrow-right" size="sm" aria-hidden />
              </Link>
              <Link
                href={routes.signIn}
                className={buttonVariants({ variant: 'outline', size: 'lg' })}
              >
                {t('cta_secondary')}
              </Link>
            </div>

            <p className="animate-fade-up mt-6 text-xs text-muted-foreground [animation-delay:400ms]">
              {t('note')}
            </p>
          </div>

          <div className="animate-fade-up relative [animation-delay:250ms]">
            <PostmarkBadge className="animate-float pointer-events-none absolute -top-6 -right-6 z-10 hidden size-16 rotate-12 text-dark-espresso/25 [animation-delay:-3s] md:block" />
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-xl">
              <Image
                src={HERO_PHOTO}
                alt=""
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 58vw"
              />
            </div>
          </div>
        </div>
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
