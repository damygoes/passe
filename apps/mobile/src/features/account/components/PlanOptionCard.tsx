import type { PaidPlan } from '@passe/types'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import type { BadgeVariant } from '@/components/ui/badge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { PressableScale } from '@/components/ui/pressable-scale'
import { useTheme } from '@/hooks/useTheme'

const badgeVariantByPlan: Record<PaidPlan, BadgeVariant> = {
  explorer: 'plan-explorer',
  collector: 'plan-collector',
}

interface PlanOptionCardProps {
  plan: PaidPlan
  planName: string
  tagline: string
  priceString: string
  perMonthLabel: string
  bullets: string[]
  isSelected: boolean
  isCurrent: boolean
  currentPlanLabel: string
  onSelect: () => void
}

export function PlanOptionCard({
  plan,
  planName,
  tagline,
  priceString,
  perMonthLabel,
  bullets,
  isSelected,
  isCurrent,
  currentPlanLabel,
  onSelect,
}: PlanOptionCardProps) {
  const { colors, spacing, fontSizes, fontWeights, borderRadius } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        shadow: {
          borderRadius: borderRadius.xl,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
          elevation: 3,
        },
        card: { borderWidth: 0.5, borderColor: colors.border, gap: spacing[4] },
        selectedCard: { borderWidth: 2, borderColor: colors.primary },
        header: { alignItems: 'center' },
        titleGroup: { flex: 1, gap: spacing[2] },
        tagline: { fontSize: fontSizes.sm, color: colors.mutedForeground },
        content: { gap: spacing[3], paddingTop: 0 },
        priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing[1] },
        price: {
          fontSize: fontSizes['2xl'],
          fontWeight: fontWeights.bold,
          color: colors.foreground,
        },
        perMonth: { fontSize: fontSizes.sm, color: colors.mutedForeground },
        bulletList: { gap: spacing[3] },
        bulletRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
        bulletText: { fontSize: fontSizes.sm, color: colors.foreground },
      }),
    [colors, spacing, fontSizes, fontWeights, borderRadius],
  )

  return (
    <PressableScale
      onPress={onSelect}
      disabled={isCurrent}
      containerStyle={styles.shadow}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected, disabled: isCurrent }}
      accessibilityLabel={planName}
    >
      <Card style={[styles.card, isSelected && styles.selectedCard]}>
        <CardHeader style={styles.header}>
          <View style={styles.titleGroup}>
            <Badge variant={badgeVariantByPlan[plan]} size="lg">
              {planName}
            </Badge>
            <Text style={styles.tagline}>{tagline}</Text>
          </View>
          {isCurrent && (
            <Badge variant="outline" size="md">
              {currentPlanLabel}
            </Badge>
          )}
        </CardHeader>
        <CardContent style={styles.content}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{priceString}</Text>
            <Text style={styles.perMonth}>{perMonthLabel}</Text>
          </View>
          <View style={styles.bulletList}>
            {bullets.map((bullet) => (
              <View key={bullet} style={styles.bulletRow}>
                <Icon name="check" size="sm" color={colors.primary} />
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}
          </View>
        </CardContent>
      </Card>
    </PressableScale>
  )
}
