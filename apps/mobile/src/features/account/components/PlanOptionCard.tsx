import { colors as brandColors } from '@passe/theme'
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

// Collector reads as the "premium" tier by using a solid dark-espresso card
// with cream text — fixed brand inks rather than semantic tokens, like
// PaywallHero, so it looks intentionally dark in both light and dark mode
// rather than inverting. Explorer sits on the sandy-beige secondary surface;
// no per-tier tint for the header, only the card body.
const espresso = brandColors.darkEspresso.DEFAULT
const cream = brandColors.agedCream.DEFAULT

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
  const { colors, fonts, spacing, fontSizes, borderRadius } = useTheme()
  const isDark = plan === 'collector'
  const tint = isDark ? cream : colors.foreground
  const mutedTint = isDark ? `${cream}CC` : colors.mutedForeground

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
        card: {
          borderWidth: 0,
          gap: spacing[4],
          backgroundColor: isDark ? espresso : colors.secondary,
        },
        selectedCard: { borderWidth: 2, borderColor: isDark ? cream : colors.primary },
        header: { alignItems: 'center' },
        titleGroup: { flex: 1, gap: spacing[2] },
        tagline: { fontSize: fontSizes.sm, color: mutedTint },
        content: { gap: spacing[3], paddingTop: 0 },
        priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing[1] },
        price: { fontFamily: fonts.display, fontSize: fontSizes['3xl'], color: tint },
        perMonth: { fontSize: fontSizes.sm, color: mutedTint },
        bulletList: { gap: spacing[3] },
        bulletRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
        bulletText: { fontSize: fontSizes.sm, color: tint },
      }),
    [isDark, tint, mutedTint, colors, fonts, spacing, fontSizes, borderRadius],
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
            <Badge variant={isDark ? 'secondary' : 'outline'} size="md">
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
                <Icon name="check" size="sm" color={isDark ? cream : colors.primary} />
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}
          </View>
        </CardContent>
      </Card>
    </PressableScale>
  )
}
