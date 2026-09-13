import { useAllMemories, useTrips } from '@passe/hooks'
import {
  formatLongDate,
  getPersonalStatsFacts,
  getUniqueCities,
  getUniqueStatsFromTrips,
} from '@passe/utils'
import { useMemo } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'

import { Skeleton } from '@/components/ui/skeleton'
import { StatTile } from '@/components/ui/stat-tile'
import { NoTripsEmpty } from '@/features/trips/components/trip/empty/NoTripsEmpty'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { ErrorBanner } from './ErrorBanner'

interface StatCell {
  value: number
  label: string
  note?: string
}

// Same trips.stats_screen i18n namespace apps/web's StatsGridDataWrapper
// uses — the copy is shared verbatim across platforms, only the layout
// differs (web: 3-col tile grid; mobile: the divided row list the design
// handoff actually specifies for this screen).
export function StatsListDataWrapper() {
  const t = useTranslations('trips.stats_screen')
  const { colors, fonts, spacing, fontSizes } = useTheme()
  const {
    data: trips = [],
    isLoading: tripsLoading,
    isError: tripsError,
    refetch: refetchTrips,
  } = useTrips()
  const {
    data: memories = [],
    isLoading: memoriesLoading,
    isError: memoriesError,
    refetch: refetchMemories,
  } = useAllMemories()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        scroll: { flex: 1 },
        scrollContent: { padding: spacing[6], paddingBottom: spacing[10] },
        title: {
          fontFamily: fonts.display,
          fontSize: fontSizes['4xl'],
          color: colors.foreground,
        },
        subhead: {
          fontFamily: fonts.display,
          fontStyle: 'italic',
          fontSize: fontSizes.lg,
          color: colors.primary,
          marginTop: spacing[2] + 2,
        },
        list: {
          marginTop: spacing[6],
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
        },
        row: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingVertical: spacing[4] + 2,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
        rowNote: {
          flexShrink: 1,
          maxWidth: 160,
          marginLeft: spacing[4],
          fontSize: fontSizes.sm,
          color: colors.mutedForeground,
          textAlign: 'right',
        },
        furthestCard: {
          marginTop: spacing[6],
          backgroundColor: colors.popover,
          borderRadius: 26,
          padding: spacing[6] - 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        },
        furthestTitle: {
          fontFamily: fonts.display,
          fontSize: fontSizes['2xl'],
          color: colors.foreground,
        },
        furthestBody: {
          marginTop: spacing[2] + 2,
          fontSize: 14.5,
          lineHeight: 21,
          color: colors.mutedForeground,
        },
      }),
    [colors, fonts, spacing, fontSizes],
  )

  if (tripsLoading || memoriesLoading) {
    return <Skeleton style={{ flex: 1, margin: spacing[6], borderRadius: 20 }} />
  }

  if (tripsError || memoriesError) {
    return (
      <Animated.View entering={FadeIn.duration(200)} style={{ padding: spacing[8] }}>
        <ErrorBanner
          message={t('load_error')}
          onRetry={() => {
            refetchTrips()
            refetchMemories()
          }}
        />
      </Animated.View>
    )
  }

  if (trips.length === 0) {
    return (
      <Animated.View entering={FadeIn.duration(200)} style={{ flex: 1, padding: spacing[8] }}>
        <NoTripsEmpty />
      </Animated.View>
    )
  }

  const { uniqueCountries, uniqueYears } = getUniqueStatsFromTrips({ trips })
  const { uniqueCities } = getUniqueCities({ allMemories: memories })
  const facts = getPersonalStatsFacts({ trips, memories })

  const cells: StatCell[] = [
    {
      value: uniqueCountries.size,
      label: t('countries', { count: uniqueCountries.size }),
      note: facts.mostRecentCountry
        ? t('countries_note', { country: facts.mostRecentCountry })
        : undefined,
    },
    {
      value: uniqueCities.size,
      label: t('cities', { count: uniqueCities.size }),
      note:
        facts.repeatCitiesCount > 0
          ? t('cities_note_repeat', { count: facts.repeatCitiesCount })
          : t('cities_note_none'),
    },
    {
      value: facts.tripsCount,
      label: t('trips_label', { count: facts.tripsCount }),
      note: facts.firstTripTitle ? t('trips_note', { title: facts.firstTripTitle }) : undefined,
    },
    {
      value: facts.memoriesCount,
      label: t('memories', { count: facts.memoriesCount }),
      note:
        facts.privateMemoriesCount > 0
          ? t('memories_note_private', { count: facts.privateMemoriesCount })
          : t('memories_note_none'),
    },
    {
      value: facts.daysAwayCount,
      label: t('days_away', { count: facts.daysAwayCount }),
      note: t('days_away_note'),
    },
  ]

  return (
    <Animated.View entering={FadeIn.duration(200)} style={{ flex: 1 }}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{t('title')}</Text>
        <Text style={styles.subhead}>
          {t('subhead', {
            cities: uniqueCities.size,
            countries: uniqueCountries.size,
            years: uniqueYears.size,
          })}
        </Text>

        <View style={styles.list}>
          {cells.map((cell) => (
            <View key={cell.label} style={styles.row}>
              <StatTile value={cell.value} label={cell.label} tone="plain" size="lg" />
              {cell.note ? <Text style={styles.rowNote}>{cell.note}</Text> : null}
            </View>
          ))}
        </View>

        <View style={styles.furthestCard}>
          <Text style={styles.furthestTitle}>{t('furthest_title')}</Text>
          <Text style={styles.furthestBody}>
            {facts.furthestMemory
              ? t('furthest_body', {
                  city: facts.furthestMemory.city ?? t('somewhere'),
                  country: facts.furthestMemory.country ?? '',
                  distance: facts.furthestMemory.distanceKm,
                  date: formatLongDate(facts.furthestMemory.capturedAt),
                })
              : t('furthest_body_empty')}
          </Text>
        </View>
      </ScrollView>
    </Animated.View>
  )
}
