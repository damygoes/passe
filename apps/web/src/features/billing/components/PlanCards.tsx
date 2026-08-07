'use client'

import { PLAN_LIMITS } from '@passe/auth/plan-gates'
import { useCreateCheckoutSession, useCreatePortalSession } from '@passe/hooks'
import type { BillingRedirect, PaidPlan, Plan, PlanSource } from '@passe/types'
import { Badge } from '@passe/ui/badge'
import { Button } from '@passe/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@passe/ui/card'
import { Icon } from '@passe/ui/icon'
import { Separator } from '@passe/ui/separator'
import { cn } from '@passe/utils'
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

  const isPending = checkout.isPending || portal.isPending
  const hasError = checkout.isError || portal.isError
  const hasPaidPlan = currentPlan !== 'free'
  const isManagedOnMobile = planSource === 'revenuecat'

  const openCheckout = (plan: PaidPlan) => checkout.mutate(plan, { onSuccess: redirectToStripe })
  const openPortal = () => portal.mutate(undefined, { onSuccess: redirectToStripe })

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const limits = PLAN_LIMITS[plan]
          const isCurrent = plan === currentPlan
          const bullets = [
            limits.maxTrips === Infinity
              ? tPricing('bullets.trips_unlimited')
              : tPricing('bullets.trips', { count: limits.maxTrips }),
            limits.maxMemoriesPerTrip === Infinity
              ? tPricing('bullets.memories_unlimited')
              : tPricing('bullets.memories', { count: limits.maxMemoriesPerTrip }),
            limits.publicPortfolio
              ? tPricing('bullets.portfolio_yes')
              : tPricing('bullets.portfolio_no'),
          ]

          return (
            <Card key={plan} className={cn('relative h-full', isCurrent && 'ring-2 ring-primary')}>
              {isCurrent && <Badge className="absolute top-4 right-4">{t('current_plan')}</Badge>}
              <CardHeader>
                <h3 className="font-heading text-lg font-semibold">
                  {tPricing(`plans.${plan}.name`)}
                </h3>
                <p className="text-sm text-muted-foreground">{tPricing(`plans.${plan}.tagline`)}</p>
              </CardHeader>
              <CardContent>
                <p>
                  <span className="font-display text-4xl font-bold">
                    {tPricing(`plans.${plan}.price`)}
                  </span>
                  <span className="ml-1 text-sm text-muted-foreground">
                    {tPricing('per_month')}
                  </span>
                </p>
                <Separator className="my-5" />
                <ul className="flex flex-col gap-3 text-sm">
                  {bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-2">
                      <Icon name="check" size="sm" className="text-primary" aria-hidden />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                {isCurrent ? (
                  <Button variant="outline" className="w-full" disabled>
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
                  <Button
                    className="w-full"
                    disabled={isPending}
                    onClick={() => openCheckout(plan)}
                  >
                    {t('upgrade_to', { plan: tPricing(`plans.${plan}.name`) })}
                  </Button>
                ) : null}
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {hasPaidPlan && (
        <div className="mt-8 flex flex-col items-start gap-2">
          {isManagedOnMobile ? (
            <p className="text-sm text-muted-foreground">{t('managed_on_mobile')}</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">{t('portal_hint')}</p>
              <Button variant="secondary" disabled={isPending} onClick={openPortal}>
                {t('manage_subscription')}
              </Button>
            </>
          )}
        </div>
      )}

      {hasError && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {t('action_error')}
        </p>
      )}
    </div>
  )
}
