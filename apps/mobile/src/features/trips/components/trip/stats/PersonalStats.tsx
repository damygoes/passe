import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { AnimatedNumber } from '@/components/ui/animated-number'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import type { IconName } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { LIST_STAGGER_MS } from '@/lib/motion'

interface PersonalStatsProps {
  countriesCount: number
  citiesCount: number
  yearsCount: number
}

export function PersonalStats({ countriesCount, citiesCount, yearsCount }: PersonalStatsProps) {
  const t = useTranslations('trips.stats')
  const { colors, spacing, fontSizes, fontWeights } = useTheme()

  const stats: { icon: IconName; count: number; label: string }[] = [
    { icon: 'globe', count: countriesCount, label: t('countries', { count: countriesCount }) },
    { icon: 'location', count: citiesCount, label: t('cities', { count: citiesCount }) },
    { icon: 'calendar', count: yearsCount, label: t('years', { count: yearsCount }) },
  ]

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { width: '100%', flexDirection: 'row', gap: spacing[3] },
        card: { flex: 1 },
        content: { gap: spacing[1] },
        count: {
          fontSize: fontSizes['2xl'],
          fontWeight: fontWeights.semibold,
          color: colors.foreground,
        },
        label: { fontSize: fontSizes.sm, color: colors.mutedForeground },
      }),
    [colors, spacing, fontSizes, fontWeights],
  )

  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <Card key={stat.icon} size="sm" style={styles.card}>
          <CardContent style={styles.content}>
            <Icon name={stat.icon} size="md" color={colors.primary} />
            <AnimatedNumber
              value={stat.count}
              delayMs={index * LIST_STAGGER_MS}
              style={styles.count}
            />
            <Text style={styles.label}>{stat.label}</Text>
          </CardContent>
        </Card>
      ))}
    </View>
  )
}
