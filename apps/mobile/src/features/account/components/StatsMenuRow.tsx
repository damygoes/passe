import { useAllMemories, useTrips } from '@passe/hooks'
import { getUniqueCities, getUniqueStatsFromTrips } from '@passe/utils'
import { useRouter } from 'expo-router'
import { Text } from 'react-native'

import { AccountMenuRow } from '@/features/account/components/AccountMenuRow'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

// The entry point into the standalone Stats screen — a single link row (not
// the stats themselves) grouped under its own labeled section, mirroring how
// Plan/Portfolio/Profile are entry points into their own screens rather than
// being rendered inline here.
export function StatsMenuRow() {
  const router = useRouter()
  const { colors, fontSizes } = useTheme()
  const t = useTranslations('trips.stats_screen')
  const { data: trips = [] } = useTrips()
  const { data: memories = [] } = useAllMemories()

  const hasData = trips.length > 0
  const { uniqueCountries, uniqueYears } = getUniqueStatsFromTrips({ trips })
  const { uniqueCities } = getUniqueCities({ allMemories: memories })

  return (
    <AccountMenuRow
      icon="layout"
      label={t('title')}
      trailing={
        hasData ? (
          <Text
            numberOfLines={1}
            style={{
              flexShrink: 1,
              maxWidth: 140,
              fontSize: fontSizes.sm,
              color: colors.mutedForeground,
              textAlign: 'right',
            }}
          >
            {t('subhead', {
              cities: uniqueCities.size,
              countries: uniqueCountries.size,
              years: uniqueYears.size,
            })}
          </Text>
        ) : undefined
      }
      onPress={() => router.push('/(app)/account/stats')}
    />
  )
}
