import { FadeIn } from '@/components/motion/FadeIn'
import { routes } from '@/lib/routes'
import { buttonVariants } from '@passe/ui/button'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { HERO_PHOTO } from '../constants'
import { ExitLink } from './ExitLink'
import { StoreBadges } from './StoreBadges'

// Two-column split, per the redesign's welcome screen: wordmark lives in
// LandingHeader above this section, so the left column starts straight at
// the badge/headline and a full-height washed photo fills the right column.
// cta_secondary stays "Sign in" rather than the handoff's literal "See an
// example" — there's no real public demo portfolio to showcase yet, and a
// broken/staged example link would be worse than the deviation. The handoff's
// client-side email-capture form is likewise skipped: there's no waitlist
// backend anywhere in this codebase, so the primary CTA is a real sign-up
// link rather than a form with a fabricated success state.
export async function HeroSection() {
  const t = await getTranslations('landing.hero')

  return (
    <section className="grid min-h-[calc(100svh-4rem)] grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-end px-6 py-16 md:px-[70px] md:py-[90px]">
        <FadeIn>
          <span className="inline-flex items-center gap-2 rounded-full bg-deep-olive-100 px-3.5 py-1.5 font-mono text-[10.5px] tracking-[0.12em] text-deep-olive-700 uppercase">
            <span aria-hidden className="size-[7px] rounded-full bg-deep-olive-500" />
            {t('badge')}
          </span>

          <h1 className="font-display mt-5 max-w-2xl text-6xl leading-none tracking-tight text-balance sm:text-7xl md:text-8xl">
            {t('title')}
          </h1>
          <p className="mt-6 max-w-[480px] text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t('subtitle')}
          </p>

          <div className="mt-8 flex max-w-[500px] flex-wrap items-center gap-2.5">
            <ExitLink
              href={routes.signUp}
              className={buttonVariants({ size: 'lg', className: 'h-[54px] px-7 text-base' })}
            >
              {t('cta_primary')}
            </ExitLink>
            <ExitLink
              href={routes.signIn}
              className={buttonVariants({
                variant: 'outline',
                size: 'lg',
                className: 'h-[54px] px-7 text-base',
              })}
            >
              {t('cta_secondary')}
            </ExitLink>
          </div>

          <div className="mt-8 flex flex-wrap gap-4.5 font-mono text-[10.5px] tracking-[0.1em] text-muted-foreground uppercase">
            <span>{t('trust_free')}</span>
            <span>{t('trust_export')}</span>
            <span>{t('trust_no_card')}</span>
          </div>

          <StoreBadges className="mt-5 flex flex-wrap items-center gap-3" />
        </FadeIn>
      </div>

      <div className="relative hidden p-6 md:block md:py-10 md:pr-10 md:pl-0">
        <div className="washed relative h-full w-full overflow-hidden rounded-[38px] shadow-soft-lg">
          <Image
            src={HERO_PHOTO}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 0vw, 50vw"
          />
        </div>

        <div className="absolute bottom-[54px] left-0 max-w-[250px] rounded-[26px] bg-warm-white p-5 shadow-soft-md">
          <p className="font-mono text-[10.5px] tracking-[0.1em] text-muted-foreground uppercase">
            {t('memory_date')}
          </p>
          <p className="font-display mt-1.5 text-[21px] leading-[1.2]">{t('memory_title')}</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
            {t('memory_quote')}
          </p>
        </div>
      </div>
    </section>
  )
}
