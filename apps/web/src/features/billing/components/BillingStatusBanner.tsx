'use client'

import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

// Shows the outcome of a Stripe Checkout redirect (?success=true / ?canceled=true).
// The plan itself updates asynchronously via the Stripe webhook.
export function BillingStatusBanner() {
  const t = useTranslations('billing')
  const searchParams = useSearchParams()

  if (searchParams.get('success') === 'true') {
    return (
      <div
        role="status"
        className="mb-6 rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary"
      >
        {t('success_banner')}
      </div>
    )
  }

  if (searchParams.get('canceled') === 'true') {
    return (
      <div
        role="status"
        className="mb-6 rounded-lg border border-border bg-muted px-4 py-3 text-sm text-muted-foreground"
      >
        {t('canceled_banner')}
      </div>
    )
  }

  return null
}
