import { useMapPoints, useTrips } from '@passe/hooks'
import { MAP_PIN_COLOR } from '@passe/map'
import { getUniqueCities, getVisitedCountries } from '@passe/utils'
import { useMemo } from 'react'
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'

import { Skeleton } from '@/components/ui/skeleton'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { getRecentPins } from '../utils/getRecentPins'
import { NoGeotaggedMemoriesEmpty } from './NoGeotaggedMemoriesEmpty'
import { WorldMap } from './WorldMap'

// A fraction of the window rather than a fixed px value — the map is the
// point of this screen, so let it dominate on tall phones too, not just
// clear a fixed minimum on small ones.
const MAP_BAND_HEIGHT_RATIO = 0.58
const MIN_MAP_BAND_HEIGHT = 460
const MAP_BAND_PADDING = 10
const MAP_BAND_RADIUS = 26

export function MapDataWrapper() {
  const t = useTranslations('map')
  const { colors, fonts, spacing, fontSizes } = useTheme()
  const { height: windowHeight } = useWindowDimensions()
  const mapBandHeight = Math.max(MIN_MAP_BAND_HEIGHT, windowHeight * MAP_BAND_HEIGHT_RATIO)
  const {
    data: points = [],
    isLoading: pointsLoading,
    isError: pointsError,
    refetch,
  } = useMapPoints()
  const { data: trips = [], isLoading: tripsLoading, isError: tripsError } = useTrips()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        scroll: { flex: 1 },
        scrollContent: { paddingBottom: spacing[8] },
        header: { paddingHorizontal: spacing[6], paddingTop: spacing[2] },
        title: {
          fontFamily: fonts.display,
          fontSize: fontSizes['4xl'],
          color: colors.foreground,
        },
        summary: {
          fontFamily: fonts.mono,
          fontSize: 10.5,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: colors.mutedForeground,
          marginTop: spacing[2],
        },
        band: {
          marginTop: spacing[4],
          marginHorizontal: spacing[4],
          backgroundColor: colors.secondary,
          borderRadius: MAP_BAND_RADIUS,
          padding: MAP_BAND_PADDING,
        },
        mapWrapper: { height: mapBandHeight },
        pinsSection: { paddingHorizontal: spacing[6] },
        pinsLabel: {
          fontFamily: fonts.mono,
          fontSize: 10.5,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: colors.mutedForeground,
          marginTop: spacing[6],
          marginBottom: spacing[2] + 2,
        },
        pinRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[3],
          paddingVertical: spacing[3] - 1,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
        pinDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: MAP_PIN_COLOR },
        pinName: {
          flex: 1,
          fontFamily: fonts.display,
          fontSize: fontSizes.lg,
          color: colors.foreground,
        },
        pinMeta: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.mutedForeground },
      }),
    [colors, fonts, spacing, fontSizes, mapBandHeight],
  )

  if (pointsLoading || tripsLoading) return <Skeleton style={{ flex: 1 }} />
  if (pointsError || tripsError) {
    return (
      <Animated.View entering={FadeIn.duration(200)} style={{ padding: spacing[8] }}>
        <ErrorBanner message={t('load_error')} onRetry={() => refetch()} />
      </Animated.View>
    )
  }
  if (points.length === 0) {
    return (
      <Animated.View entering={FadeIn.duration(200)} style={{ flex: 1, padding: spacing[8] }}>
        <NoGeotaggedMemoriesEmpty />
      </Animated.View>
    )
  }

  const { visitedCountries } = getVisitedCountries({ allTrips: trips })
  const { uniqueCities } = getUniqueCities({ allMemories: points })
  const years = [...new Set(trips.map((trip) => new Date(trip.startDate).getFullYear()))].sort(
    (a, b) => a - b,
  )
  const yearRange =
    years.length > 1
      ? `${years[0]} – ${years[years.length - 1]}`
      : String(years[0] ?? new Date().getFullYear())
  const recentPins = getRecentPins(points, trips)

  return (
    <Animated.View entering={FadeIn.duration(200)} style={{ flex: 1 }}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('title')}</Text>
          <Text style={styles.summary}>
            {t('summary', {
              countries: visitedCountries.size,
              cities: uniqueCities.size,
              yearRange,
            })}
          </Text>
        </View>

        <View style={styles.band}>
          <View style={styles.mapWrapper}>
            <WorldMap points={points} visitedCountries={[...visitedCountries]} />
          </View>
        </View>

        {recentPins.length > 0 && (
          <View style={styles.pinsSection}>
            <Text style={styles.pinsLabel}>{t('recent_pins')}</Text>
            {recentPins.map((pin) => (
              <View key={pin.id} style={styles.pinRow}>
                <View style={styles.pinDot} />
                <Text style={styles.pinName}>{pin.name}</Text>
                <Text style={styles.pinMeta}>{pin.meta}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </Animated.View>
  )
}
