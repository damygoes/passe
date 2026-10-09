'use client'

import { FadeIn } from '@/components/motion/FadeIn'
import { SECTION_STEP } from '@/lib/motion'
import { useTranslations } from 'next-intl'
import { Suspense } from 'react'
import { BillingDataWrapper } from '../components/BillingDataWrapper'
import { BillingStatusBanner } from '../components/BillingStatusBanner'
import { BillingViewSkeleton } from '../components/BillingViewSkeleton'

export function BillingView() {
  const t = useTranslations('billing')

  return (
    <div className="container mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
      <FadeIn>
        <h1 className="font-display text-4xl sm:text-5xl">{t('title')}</h1>
        <p className="mt-3 max-w-[520px] text-[16px] text-muted-foreground">{t('subtitle')}</p>
      </FadeIn>

      {/* useSearchParams requires a Suspense boundary during prerender */}
      <Suspense fallback={null}>
        <div className="mt-6">
          <BillingStatusBanner />
        </div>
      </Suspense>

      <FadeIn delay={SECTION_STEP} className="mt-9">
        {/* PlanCards reads ?reason= to pick the featured plan, so it needs its own
            Suspense boundary during prerender — same as BillingStatusBanner above. */}
        <Suspense fallback={<BillingViewSkeleton />}>
          <BillingDataWrapper />
        </Suspense>
      </FadeIn>

      <p className="mt-6 text-center font-mono text-[10.5px] tracking-[0.1em] text-muted-foreground uppercase">
        {t('footer_caption')}
      </p>
    </div>
  )
}
