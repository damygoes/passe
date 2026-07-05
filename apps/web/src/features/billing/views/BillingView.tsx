'use client'

import { Separator } from '@passe/ui/separator'
import { useTranslations } from 'next-intl'
import { Suspense } from 'react'
import { BillingDataWrapper } from '../components/BillingDataWrapper'
import { BillingStatusBanner } from '../components/BillingStatusBanner'

export function BillingView() {
  const t = useTranslations('billing')

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 md:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t('subtitle')}</p>

      <Separator className="my-6" />

      {/* useSearchParams requires a Suspense boundary during prerender */}
      <Suspense fallback={null}>
        <BillingStatusBanner />
      </Suspense>

      <BillingDataWrapper />
    </div>
  )
}
