import { Reveal } from '@/components/shared/Reveal'
import { Icon } from '@passe/ui/icon'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

// Real App Store badge not available yet — set once the user supplies it.
const IOS_HREF: string | null = 'https://www.damilolabada.com'
// Real store listing not published yet — set once the app goes live.
const ANDROID_HREF: string | null = 'https://www.damilolabada.com'

export async function MobileAppSection() {
  const t = await getTranslations('landing.mobileApp')

  const iosBadge = (
    <div className="flex h-[60px] items-center gap-3 rounded-xl bg-dark-espresso px-5 text-aged-cream">
      <Icon name="apple" size="2xl" aria-hidden />
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[11px] tracking-wide opacity-80">{t('ios_eyebrow')}</span>
        <span className="text-base font-semibold">{t('ios_name')}</span>
      </span>
    </div>
  )

  const androidBadge = (
    <Image src="/badges/google-play-badge.svg" alt={t('android')} width={202} height={60} />
  )

  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
        <Reveal>
          <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon name="swap" size="lg" aria-hidden />
          </div>
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {t('eyebrow')}
          </p>
          <h2 className="font-display mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            {t('heading')}
          </h2>
          <p className="mt-4 text-muted-foreground">{t('description')}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {IOS_HREF ? <a href={IOS_HREF}>{iosBadge}</a> : iosBadge}
            {ANDROID_HREF ? <a href={ANDROID_HREF}>{androidBadge}</a> : androidBadge}
          </div>
        </Reveal>

        <Reveal delay={150} className="mx-auto w-full max-w-xs">
          <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[2.5rem] border-8 border-dark-espresso bg-gradient-to-b from-sandy-beige to-sandy-beige-dark shadow-xl shadow-dark-espresso/20">
            <Image
              src="/mobile-app-preview.png"
              alt={t('screenshotAlt')}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 80vw, 320px"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
