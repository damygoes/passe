import type { PlanType } from '@passe/auth/types'
import { useUser } from '@passe/hooks'
import { useRouter } from 'expo-router'

import { Badge, type BadgeVariant } from '@/components/ui/badge'
import { AccountMenuRow } from '@/features/account/components/AccountMenuRow'
import { useTranslations } from '@/i18n/useTranslations'

const badgeVariantByPlan: Record<PlanType, BadgeVariant> = {
  free: 'ghost',
  explorer: 'plan-explorer',
  collector: 'plan-collector',
}

// Replaces the old standalone "Current plan" card with a row grouped
// alongside Profile/Security — the plan tier now reads as one more account
// fact rather than its own prominent block, with the badge as the only
// plan-specific affordance.
export function PlanMenuRow() {
  const router = useRouter()
  const t = useTranslations('account')
  const tPlans = useTranslations('landing.pricing.plans')
  const { data: user } = useUser()

  return (
    <AccountMenuRow
      icon="sparkles"
      label={t('plan.title')}
      trailing={
        user ? (
          <Badge variant={badgeVariantByPlan[user.plan]} size="sm">
            {tPlans(`${user.plan}.name`)}
          </Badge>
        ) : undefined
      }
      onPress={() => router.push('/(app)/account/paywall')}
    />
  )
}
