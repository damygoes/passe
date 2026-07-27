'use client'

import { Stagger } from '@/components/motion/Stagger'
import { gentleSpring } from '@/lib/motion'
import { m } from 'motion/react'
import { useTranslations } from 'next-intl'
import { PricingCard } from './PricingCard'
import { SectionHeading } from './SectionHeading'
import { SectionStamp } from './SectionStamp'

const PLANS = ['free', 'explorer', 'collector'] as const

export function PricingSection() {
  const t = useTranslations('landing.pricing')

  return (
    <section className="relative overflow-x-hidden px-6 py-24 md:py-32">
      <div
        aria-hidden
        className="animate-drift pointer-events-none absolute top-10 -right-24 -z-10 size-80 rounded-full bg-terracotta/10 blur-3xl [animation-delay:-13s]"
      />
      <div className="relative mx-auto max-w-6xl">
        <SectionStamp className="-top-6 right-2 md:right-8" rotate={11} />
        <m.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '0px 0px -15% 0px' }}
          transition={gentleSpring}
        >
          <SectionHeading title={t('heading')} subtitle={t('subheading')} />
        </m.div>

        <Stagger inView className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <PricingCard key={plan} plan={plan} />
          ))}
        </Stagger>
      </div>
    </section>
  )
}
