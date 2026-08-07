'use client'

import { FadeIn } from '@/components/motion/FadeIn'
import { SECTION_STEP } from '@/lib/motion'
import { PageHeader, PageHeaderDescription, PageHeaderTitle } from '@passe/ui/page-header'
import { Separator } from '@passe/ui/separator'
import { useTranslations } from 'next-intl'
import { Suspense } from 'react'
import { BillingDataWrapper } from '../components/BillingDataWrapper'
import { BillingStatusBanner } from '../components/BillingStatusBanner'

export function BillingView() {
  const t = useTranslations('billing')

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 md:px-6">
      <FadeIn>
        <PageHeader className="w-full">
          <PageHeaderTitle>{t('title')}</PageHeaderTitle>
          <PageHeaderDescription>{t('subtitle')}</PageHeaderDescription>
        </PageHeader>
      </FadeIn>

      <Separator className="my-6" />

      {/* useSearchParams requires a Suspense boundary during prerender */}
      <Suspense fallback={null}>
        <BillingStatusBanner />
      </Suspense>

      <FadeIn delay={SECTION_STEP}>
        <BillingDataWrapper />
      </FadeIn>
    </div>
  )
}
