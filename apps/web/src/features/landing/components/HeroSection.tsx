import { FadeIn } from '@/components/motion/FadeIn'
import { routes } from '@/lib/routes'
import { buttonVariants } from '@passe/ui/button'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { HERO_PHOTO } from '../constants'
import { ExitLink } from './ExitLink'

// Two-column split, per the redesign's welcome screen: wordmark lives in
// LandingHeader above this section, so the left column starts straight at
// the headline (pushed to the bottom of the column) and a full-height washed
// photo fills the right column. cta_secondary stays "Sign in" rather than
// the design's literal "See an example" — there's no real public portfolio
// to showcase yet, and a broken/staged example link would be worse than the
// deviation. Revisit once a real demo portfolio exists.
export async function HeroSection() {
  const t = await getTranslations('landing.hero')

  return (
    <section className="grid min-h-[calc(100svh-4rem)] grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-end px-6 py-16 md:px-[70px] md:py-[90px]">
        <FadeIn>
          <h1 className="font-display max-w-2xl text-6xl leading-none tracking-tight text-balance sm:text-7xl md:text-8xl">
            {t('title')}
          </h1>
          <p className="mt-6 max-w-[420px] text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t('subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ExitLink href={routes.signUp} className={buttonVariants({ size: 'lg' })}>
              {t('cta_primary')}
            </ExitLink>
            <ExitLink
              href={routes.signIn}
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              {t('cta_secondary')}
            </ExitLink>
          </div>
          <div className="mt-10 flex flex-wrap gap-6 font-mono text-[10.5px] tracking-[0.1em] text-muted-foreground uppercase">
            <span>{t('caption_private')}</span>
            <span>{t('caption_no_feed')}</span>
            <span>{t('caption_export')}</span>
          </div>
        </FadeIn>
      </div>
      <div className="hidden p-6 md:block md:py-10 md:pr-10 md:pl-0">
        <div className="washed relative h-full w-full overflow-hidden rounded-[34px]">
          <Image
            src={HERO_PHOTO}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 0vw, 50vw"
          />
        </div>
      </div>
    </section>
  )
}
