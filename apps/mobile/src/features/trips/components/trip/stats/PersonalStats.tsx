import { colors as brandColors } from '@passe/theme'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { AnimatedNumber } from '@/components/ui/animated-number'
import { Card, CardContent } from '@/components/ui/card'
import type { IconName } from '@/components/ui/icon'
import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { LIST_STAGGER_MS } from '@/lib/motion'

interface PersonalStatsProps {
  countriesCount: number
  citiesCount: number
  yearsCount: number
}

// The stamp face is always aged-cream/espresso ink regardless of app
// dark/light mode, same reasoning as TripCard's scrapbook polaroid caption.
const espresso = brandColors.darkEspresso.DEFAULT
const cream = brandColors.agedCream.DEFAULT
const terracottaDark = brandColors.terracotta.dark
const mutedTaupe = brandColors.mutedTaupe.DEFAULT

export function PersonalStats({ countriesCount, citiesCount, yearsCount }: PersonalStatsProps) {
  const t = useTranslations('trips.stats')
  const { colors, fonts, spacing, fontSizes, fontWeights, isScrapbook } = useTheme()

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
        // Scrapbook theme's own stat style — a passport/postmark stamp
        // instead of a plain card, matching the country-badge motif on
        // TripCard's polaroid caption.
        stampsRow: {
          width: '100%',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: spacing[4],
        },
        stamp: {
          height: 96,
          width: 96,
          borderRadius: 48,
          borderWidth: 1.5,
          borderStyle: 'dashed',
          borderColor: `${terracottaDark}80`,
          backgroundColor: cream,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          shadowColor: espresso,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.14,
          shadowRadius: 16,
          elevation: 3,
        },
        stampTiltLeft: { transform: [{ rotate: '-2deg' }] },
        stampTiltRight: { transform: [{ rotate: '2deg' }] },
        stampCount: {
          fontFamily: fonts.display,
          fontSize: fontSizes.xl,
          fontWeight: fontWeights.bold,
          color: espresso,
        },
        stampLabel: {
          fontFamily: fonts.annotation,
          fontSize: fontSizes.sm,
          lineHeight: fontSizes.sm,
          color: mutedTaupe,
        },
      }),
    [colors, fonts, spacing, fontSizes, fontWeights],
  )

  if (isScrapbook) {
    return (
      <View style={styles.stampsRow}>
        {stats.map((stat, index) => (
          <View
            key={stat.icon}
            style={[styles.stamp, index % 2 === 0 ? styles.stampTiltLeft : styles.stampTiltRight]}
          >
            <Icon name={stat.icon} size="md" color={brandColors.terracotta.DEFAULT} />
            <AnimatedNumber
              value={stat.count}
              delayMs={index * LIST_STAGGER_MS}
              style={styles.stampCount}
            />
            <Text style={styles.stampLabel} numberOfLines={1}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    )
  }

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
