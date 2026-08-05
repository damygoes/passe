'use client'

import { gentleSpring } from '@/lib/motion'
import { Icon } from '@passe/ui/icon'
import { m } from 'motion/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { MOBILE_SCREENSHOT_PRIMARY, MOBILE_SCREENSHOT_SECONDARY } from '../constants'
import { SectionHeading } from './SectionHeading'

// Real App Store badge not available yet — set once the user supplies it.
const IOS_HREF: string | null = 'https://www.damilolabada.com'
// Real store listing not published yet — set once the app goes live.
const ANDROID_HREF: string | null = 'https://www.damilolabada.com'

export function MobileAppSection() {
  const t = useTranslations('landing.mobileApp')

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
    <section className="overflow-x-hidden px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '0px 0px -15% 0px' }}
          transition={gentleSpring}
        >
          <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon name="swap" size="lg" aria-hidden />
          </div>
          <SectionHeading eyebrow={t('eyebrow')} title={t('heading')} subtitle={t('description')} />

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {IOS_HREF ? <a href={IOS_HREF}>{iosBadge}</a> : iosBadge}
            {ANDROID_HREF ? <a href={ANDROID_HREF}>{androidBadge}</a> : androidBadge}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{t('subscriptionHint')}</p>
        </m.div>

        <div className="relative mx-auto w-full max-w-sm py-4">
          <m.div
            className="absolute top-2 left-0 aspect-[9/19] w-[62%] overflow-hidden rounded-[2.5rem] border-8 border-dark-espresso bg-gradient-to-b from-sandy-beige to-sandy-beige-dark opacity-90 shadow-lg shadow-dark-espresso/15"
            initial={{ opacity: 0, x: -24, rotate: -14 }}
            whileInView={{ opacity: 0.9, x: 0, rotate: -6 }}
            animate={{ y: [0, -10, 0] }}
            viewport={{ once: false, margin: '0px 0px -15% 0px' }}
            transition={{
              opacity: { ...gentleSpring, delay: 0.15 },
              x: { ...gentleSpring, delay: 0.15 },
              rotate: { ...gentleSpring, delay: 0.15 },
              y: { duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
            }}
          >
            <Image
              src={MOBILE_SCREENSHOT_SECONDARY}
              alt=""
              aria-hidden
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 220px"
            />
          </m.div>
          <m.div
            className="relative ml-[32%] aspect-[9/19] w-[62%] overflow-hidden rounded-[2.5rem] border-8 border-dark-espresso bg-gradient-to-b from-sandy-beige to-sandy-beige-dark shadow-xl shadow-dark-espresso/20"
            initial={{ opacity: 0, x: 24, rotate: 10 }}
            whileInView={{ opacity: 1, x: 0, rotate: 3 }}
            animate={{ y: [0, -14, 0] }}
            viewport={{ once: false, margin: '0px 0px -15% 0px' }}
            transition={{
              opacity: { ...gentleSpring, delay: 0.3 },
              x: { ...gentleSpring, delay: 0.3 },
              rotate: { ...gentleSpring, delay: 0.3 },
              y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <Image
              src={MOBILE_SCREENSHOT_PRIMARY}
              alt={t('screenshotAlt')}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 220px"
            />
          </m.div>
        </div>
      </div>
    </section>
  )
}
