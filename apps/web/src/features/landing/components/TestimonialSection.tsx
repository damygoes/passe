'use client'

import { gentleSpring } from '@/lib/motion'
import { Avatar, AvatarFallback } from '@passe/ui/avatar'
import { Icon } from '@passe/ui/icon'
import { m } from 'motion/react'
import { useTranslations } from 'next-intl'
import { NestedQuoteCard } from './NestedQuoteCard'

export function TestimonialSection() {
  const t = useTranslations('landing.testimonial')

  return (
    <section className="px-6 py-24 md:py-32">
      <m.div
        className="mx-auto max-w-6xl overflow-hidden rounded-[40px] bg-dark-espresso-dark p-[clamp(32px,4.5vw,58px)] text-aged-cream"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '0px 0px -15% 0px' }}
        transition={gentleSpring}
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-10">
          <div>
            <p className="font-display text-[clamp(28px,3.4vw,42px)] leading-[1.1]">
              &ldquo;{t('quote')}&rdquo;
            </p>
            <p className="mt-4 text-[15px] leading-relaxed opacity-80">{t('body')}</p>
            <div className="mt-6 flex items-center gap-3">
              <Avatar size="lg" className="bg-aged-cream/15">
                <AvatarFallback className="bg-transparent text-aged-cream">
                  <Icon name="user" size="md" aria-hidden />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{t('name')}</p>
                <p className="font-mono text-[10.5px] tracking-[0.1em] opacity-70 uppercase">
                  {t('stat')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 self-center">
            <NestedQuoteCard text={t('quote1.text')} who={t('quote1.who')} />
            <NestedQuoteCard text={t('quote2.text')} who={t('quote2.who')} />
          </div>
        </div>
      </m.div>
    </section>
  )
}
