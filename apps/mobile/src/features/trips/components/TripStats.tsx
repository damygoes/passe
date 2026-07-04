import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

interface TripStatsProps {
  countriesCount: number
  citiesCount: number
  yearsCount: number
}

export function TripStats({ countriesCount, citiesCount, yearsCount }: TripStatsProps) {
  const t = useTranslations('trips.stats')
  const { colors, spacing, fontSizes, fontWeights } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          width: '100%',
          flexDirection: 'row',
          gap: spacing[8],
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: colors.border,
          paddingVertical: spacing[4],
        },
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
      <View>
        <Text style={styles.count}>{countriesCount}</Text>
        <Text style={styles.label}>{t('countries', { count: countriesCount })}</Text>
      </View>
      <View>
        <Text style={styles.count}>{citiesCount}</Text>
        <Text style={styles.label}>{t('cities', { count: citiesCount })}</Text>
      </View>
      <View>
        <Text style={styles.count}>{yearsCount}</Text>
        <Text style={styles.label}>{t('years', { count: yearsCount })}</Text>
      </View>
    </View>
  )
}
