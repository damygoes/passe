import { PLAN_LIMITS } from '@passe/auth/plan-gates'
import type { PlanType } from '@passe/auth/types'
import { useTrips, useUser } from '@passe/hooks'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { Badge } from '@/components/ui/badge'
import type { BadgeVariant } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

const badgeVariantByPlan: Record<PlanType, BadgeVariant> = {
  free: 'ghost',
  explorer: 'plan-explorer',
  collector: 'plan-collector',
}

export function PlanSection() {
  const { spacing, borderRadius } = useTheme()
  const router = useRouter()
  const t = useTranslations('account.plan')
  const tPlans = useTranslations('landing.pricing.plans')
  const tTrips = useTranslations('trips.new')
  const { data: user, isLoading, isError } = useUser()
  const { data: trips = [] } = useTrips()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: spacing[3],
        },
        planColumn: { alignItems: 'flex-end', gap: spacing[2] },
        skeleton: { height: spacing[20], borderRadius: borderRadius.xl },
        upgradeContent: { paddingTop: 0 },
      }),
    [spacing, borderRadius],
  )

  if (isLoading) return <Skeleton style={styles.skeleton} />
  // Secondary UI — hide silently on error
  if (isError || !user) return null

  const limits = PLAN_LIMITS[user.plan]
  const usageLabel =
    limits.maxTrips === Infinity
      ? t('trips_unlimited')
      : t('trips_used', { used: trips.length, limit: limits.maxTrips })

  return (
    <Card>
      <CardHeader style={styles.header}>
        <CardDescription>{t('current')}</CardDescription>
        <View style={styles.planColumn}>
          <Badge variant={badgeVariantByPlan[user.plan]} size="lg">
            {tPlans(`${user.plan}.name`)}
          </Badge>
          <CardDescription>{usageLabel}</CardDescription>
        </View>
      </CardHeader>
      {user.plan === 'free' && (
        <CardContent style={styles.upgradeContent}>
          <Button
            size="md"
            variant="primary"
            fullWidth
            onPress={() => router.push('/(app)/account/paywall')}
          >
            {tTrips('upgrade_cta')}
          </Button>
        </CardContent>
      )}
    </Card>
  )
}
