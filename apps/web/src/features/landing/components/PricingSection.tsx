'use client'

import { Stagger } from '@/components/motion/Stagger'
import { gentleSpring } from '@/lib/motion'
import { m } from 'motion/react'
import { useTranslations } from 'next-intl'
import { PricingCard } from './PricingCard'
import { SectionHeading } from './SectionHeading'

const PLANS = ['free', 'explorer', 'collector'] as const

export function PricingSection() {
  const t = useTranslations('landing.pricing')

  return (
    <section id="plans" className="scroll-mt-[68px] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <m.div
          className="flex flex-wrap items-end justify-between gap-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '0px 0px -15% 0px' }}
          transition={gentleSpring}
        >
          <SectionHeading title={t('heading')} subtitle={t('subheading')} className="max-w-xl" />
          <span className="inline-flex items-center gap-2 rounded-full bg-popover px-5 py-[11px] font-mono text-[10.5px] tracking-[0.1em] text-muted-foreground uppercase shadow-soft-sm">
            <span aria-hidden className="size-[7px] rounded-full bg-deep-olive-500" />
            {t('monthly_note')}
          </span>
        </m.div>

        <Stagger
          inView
          className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-6"
        >
          {PLANS.map((plan) => (
            <PricingCard key={plan} plan={plan} />
          ))}
        </Stagger>

        <p className="mt-8 text-center font-mono text-[10.5px] tracking-[0.08em] text-muted-foreground uppercase">
          {t('cancel_note')}
        </p>
      </div>
    </section>
  )
}
