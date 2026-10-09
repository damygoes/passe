'use client'

import { Stagger } from '@/components/motion/Stagger'
import { PlanCard } from '@/components/shared/PlanCard'
import { isGatedFeature, upgradePlanFor } from '@passe/auth/plan-gates'
import { useCreateCheckoutSession, useCreatePortalSession } from '@passe/hooks'
import type { BillingRedirect, PaidPlan, Plan, PlanSource } from '@passe/types'
import { Badge } from '@passe/ui/badge'
import { Button } from '@passe/ui/button'
import { Card, CardContent } from '@passe/ui/card'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

const PLANS = ['free', 'explorer', 'collector'] as const

function redirectToStripe({ url }: BillingRedirect) {
  window.location.assign(url)
}

export function PlanCards({
  currentPlan,
  planSource,
}: {
  currentPlan: Plan
  planSource?: PlanSource | null
}) {
  const t = useTranslations('billing')
  const tPricing = useTranslations('landing.pricing')
  const checkout = useCreateCheckoutSession()
  const portal = useCreatePortalSession()
  const searchParams = useSearchParams()

  // Upgrade CTAs tag themselves with the feature the user was blocked on (see
  // billingRoute), so the card we feature is the one that actually unlocks it —
  // Explorer has pdfExport: false, so recommending it to someone blocked on a
  // keepsake would sell them the wrong tier. Null for an untagged visit, an
  // unknown param, or a user already on the best plan for that feature.
  const reasonParam = searchParams.get('reason') ?? undefined
  const reason = isGatedFeature(reasonParam) ? reasonParam : undefined
  const requestedPlan = reason ? upgradePlanFor(reason, currentPlan) : null
  const featuredPlan = requestedPlan ?? 'explorer'

  const isPending = checkout.isPending || portal.isPending
  const hasError = checkout.isError || portal.isError
  const hasPaidPlan = currentPlan !== 'free'
  const isManagedOnMobile = planSource === 'revenuecat'

  const openCheckout = (plan: PaidPlan) => checkout.mutate(plan, { onSuccess: redirectToStripe })
  const openPortal = () => portal.mutate(undefined, { onSuccess: redirectToStripe })

  return (
    <div>
      <Stagger className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = plan === currentPlan
          const isFeatured = plan === featuredPlan && !isCurrent

          // The current plan always wins the badge slot; a contextual "unlocks
          // this" beats the generic recommendation when the user arrived blocked.
          const badge = isCurrent ? (
            <Badge className="absolute top-4 right-4">{t('current_plan')}</Badge>
          ) : reason && plan === requestedPlan ? (
            <Badge className="absolute top-4 right-4">{tPricing(`unlocks.${reason}`)}</Badge>
          ) : !requestedPlan && isFeatured ? (
            <Badge className="absolute top-4 right-4">{tPricing('recommended')}</Badge>
          ) : undefined

          const footer = isCurrent ? (
            <Button variant="ghost" className="w-full" disabled>
              {t('current_plan')}
            </Button>
          ) : hasPaidPlan ? (
            // Subscribed users switch through the Stripe portal — a second
            // Checkout would create a second subscription. Cancelling (the
            // free card) is portal-only too, so that card gets no button.
            // RevenueCat-sourced subscribers have no Stripe portal to switch
            // through — they get no button here either (see the mobile hint below).
            plan !== 'free' &&
            !isManagedOnMobile && (
              <Button
                variant="outline"
                className="w-full"
                disabled={isPending}
                onClick={openPortal}
              >
                {t('switch_to', { plan: tPricing(`plans.${plan}.name`) })}
              </Button>
            )
          ) : plan !== 'free' ? (
            <Button className="w-full" disabled={isPending} onClick={() => openCheckout(plan)}>
              {t('upgrade_to', { plan: tPricing(`plans.${plan}.name`) })}
            </Button>
          ) : null

          return (
            <PlanCard
              key={plan}
              plan={plan}
              current={isCurrent}
              featured={isFeatured}
              badge={badge}
              footer={footer}
            />
          )
        })}
      </Stagger>

      {hasPaidPlan && (
        <Card size="sm" className="mt-8">
          <CardContent className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            {isManagedOnMobile ? (
              <p className="text-md text-pretty text-muted-foreground">{t('managed_on_mobile')}</p>
            ) : (
              <>
                <p className="text-md text-pretty text-muted-foreground">{t('portal_hint')}</p>
                <Button variant="secondary" disabled={isPending} onClick={openPortal}>
                  {t('manage_subscription')}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {hasError && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {t('action_error')}
        </p>
      )}
    </div>
  )
}
