import { useAllMemories, useTrips, useUser } from '@passe/hooks'
import { formatWeekdayDate, getUniqueCities, getUniqueStatsFromTrips } from '@passe/utils'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { StatTile } from '@/components/ui/stat-tile'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { LIST_STAGGER_MS } from '@/lib/motion'

function greetingKey(hour: number): 'greeting_morning' | 'greeting_afternoon' | 'greeting_evening' {
  if (hour < 12) return 'greeting_morning'
  if (hour < 18) return 'greeting_afternoon'
  return 'greeting_evening'
}

export function HomeHeaderDataWrapper() {
  const t = useTranslations('trips.home')
  const tStats = useTranslations('trips.stats')
  const { colors, spacing, fonts, fontSizes } = useTheme()
  const { data: user, isLoading: userLoading } = useUser()
  const { data: trips = [], isLoading: tripsLoading, isError: tripsError } = useTrips()
  const {
    data: allMemories = [],
    isLoading: memoriesLoading,
    isError: memoriesError,
  } = useAllMemories()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
        date: {
          fontFamily: fonts.mono,
          fontSize: 10.5,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: colors.mutedForeground,
        },
        greeting: {
          fontFamily: fonts.display,
          fontSize: fontSizes['3xl'],
          lineHeight: 34,
          color: colors.foreground,
          marginTop: spacing[2],
        },
        accent: {
          fontFamily: fonts.display,
          fontStyle: 'italic',
          fontSize: fontSizes.base,
          color: colors.primary,
          marginTop: spacing[3],
        },
        stats: { flexDirection: 'row', gap: spacing[2], marginTop: spacing[5] },
        stat: { flex: 1 },
        headerSkeleton: { height: 64, width: '70%' },
      }),
    [colors, spacing, fonts, fontSizes],
  )

  if (userLoading || tripsLoading || memoriesLoading) {
    return <Skeleton style={styles.headerSkeleton} />
  }

  const firstName = user?.displayName?.split(' ')[0] ?? ''
  const initials = (user?.displayName ?? '')
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const { uniqueCountries } = getUniqueStatsFromTrips({ trips })
  const { uniqueCities } = getUniqueCities({ allMemories })

  return (
    <View>
      <View style={styles.row}>
        <View>
          <Text style={styles.date}>{formatWeekdayDate(new Date())}</Text>
          <Text style={styles.greeting}>
            {t(greetingKey(new Date().getHours()), { name: firstName })}
          </Text>
        </View>
        <Avatar size="default">
          <AvatarFallback>{initials}</AvatarFallback>
          {user?.avatarUrl && <AvatarImage source={{ uri: user.avatarUrl }} />}
        </Avatar>
      </View>
      <Text style={styles.accent}>{t('accent_line')}</Text>
      {!tripsError && !memoriesError && (
        <View style={styles.stats}>
          <StatTile
            style={styles.stat}
            tone="surface"
            value={uniqueCities.size}
            label={tStats('cities', { count: uniqueCities.size })}
            delayMs={0}
          />
          <StatTile
            style={styles.stat}
            tone="surface"
            value={uniqueCountries.size}
            label={tStats('countries', { count: uniqueCountries.size })}
            delayMs={LIST_STAGGER_MS}
          />
          <StatTile
            style={styles.stat}
            tone="sand"
            value={trips.length}
            label={tStats('trips_label', { count: trips.length })}
            delayMs={LIST_STAGGER_MS * 2}
          />
        </View>
      )}
    </View>
  )
}
