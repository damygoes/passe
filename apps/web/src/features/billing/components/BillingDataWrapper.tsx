'use client'

import { useUser } from '@passe/hooks'
import { useTranslations } from 'next-intl'
import { BillingViewSkeleton } from './BillingViewSkeleton'
import { PlanCards } from './PlanCards'

export function BillingDataWrapper() {
  const t = useTranslations('billing')
  const { data: user, isLoading, isError } = useUser()

  if (isLoading) return <BillingViewSkeleton />
  if (isError || !user) return <p className="text-sm text-destructive">{t('load_error')}</p>

  return <PlanCards currentPlan={user.plan} planSource={user.planSource} />
}
