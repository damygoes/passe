import { useUser } from '@passe/hooks'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

export function PlanSection() {
  const { colors, spacing, fontSizes, borderRadius } = useTheme()
  const router = useRouter()
  const t = useTranslations('account.plan')
  const tPlans = useTranslations('landing.pricing.plans')
  const tTrips = useTranslations('trips.new')
  const { data: user, isLoading, isError } = useUser()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        header: { alignItems: 'center', paddingBottom: spacing[3] },
        titleGroup: { flex: 1, gap: spacing[1] },
        skeleton: { height: spacing[16], borderRadius: borderRadius.xl },
        upgradeCta: { fontSize: fontSizes.sm, color: colors.primary, fontWeight: '600' },
      }),
    [spacing, borderRadius, fontSizes, colors],
  )

  if (isLoading) return <Skeleton style={styles.skeleton} />
  // Secondary UI — hide silently on error
  if (isError || !user) return null

  return (
    <Card size="sm">
      <CardHeader style={styles.header}>
        <View style={styles.titleGroup}>
          <CardTitle>{t('title')}</CardTitle>
          {user.plan === 'free' && (
            <Pressable onPress={() => router.push('/(app)/account/paywall')}>
              <Text style={styles.upgradeCta}>{tTrips('upgrade_cta')}</Text>
            </Pressable>
          )}
        </View>
        <Badge>{tPlans(`${user.plan}.name`)}</Badge>
      </CardHeader>
    </Card>
  )
}
