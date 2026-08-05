import { useUser } from '@passe/hooks'
import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

// Read-only plan display — purchases and plan changes happen on the web only
// (App Store rules forbid referencing purchasing outside In-App Purchase), so
// this section deliberately has no upgrade action or purchase-directing copy.
export function PlanSection() {
  const { spacing, borderRadius } = useTheme()
  const t = useTranslations('account.plan')
  const tPlans = useTranslations('landing.pricing.plans')
  const { data: user, isLoading, isError } = useUser()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        header: { alignItems: 'center', paddingBottom: spacing[3] },
        titleGroup: { flex: 1, gap: spacing[1] },
        skeleton: { height: spacing[16], borderRadius: borderRadius.xl },
      }),
    [spacing, borderRadius],
  )

  if (isLoading) return <Skeleton style={styles.skeleton} />
  // Secondary UI — hide silently on error
  if (isError || !user) return null

  return (
    <Card size="sm">
      <CardHeader style={styles.header}>
        <View style={styles.titleGroup}>
          <CardTitle>{t('title')}</CardTitle>
        </View>
        <Badge>{tPlans(`${user.plan}.name`)}</Badge>
      </CardHeader>
    </Card>
  )
}
