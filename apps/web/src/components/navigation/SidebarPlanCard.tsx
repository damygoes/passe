'use client'

import { Link } from '@/i18n/navigation'
import { routes } from '@/lib/routes'
import { PLAN_LIMITS } from '@passe/auth/plan-gates'
import { useTrips, useUser } from '@passe/hooks'
import { Button } from '@passe/ui/button'
import { useTranslations } from 'next-intl'

export function SidebarPlanCard() {
  const t = useTranslations('sidebar.plan_card')
  const tPricing = useTranslations('landing.pricing')
  const { data: user } = useUser()
  const { data: trips = [] } = useTrips()

  if (!user) return null

  const plan = user.plan
  const limits = PLAN_LIMITS[plan]

  const note =
    plan === 'collector'
      ? t('collector_note')
      : t(`${plan}_note`, { count: trips.length, limit: limits.maxTrips })

  return (
    <div className="rounded-3xl bg-secondary p-4">
      <div className="font-mono text-[10px] tracking-[0.14em] text-secondary-foreground uppercase">
        {tPricing(`plans.${plan}.name`)}
      </div>
      <p className="mt-1.5 text-xs text-secondary-foreground/85">{note}</p>
      <Button size="sm" className="mt-2.5 w-full" render={<Link href={routes.billing} />}>
        {plan === 'collector' ? t('cta_manage') : t('cta_upgrade')}
      </Button>
    </div>
  )
}
