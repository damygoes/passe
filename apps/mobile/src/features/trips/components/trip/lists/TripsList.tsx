import { getTripSlots } from '@passe/auth/plan-gates'
import { useAllMemories, useTrips, useUser } from '@passe/hooks'
import { formatDateRange, getUniqueCities } from '@passe/utils'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'

import { Button } from '@/components/ui/button'
import { NoTripsEmpty } from '@/features/trips/components/trip/empty/NoTripsEmpty'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { paywallRoute } from '@/lib/paywall-route'
import { TripRow } from './TripRow'
import { TripsListSkeleton } from './TripsListSkeleton'

export type TripsFilter = 'all' | 'private' | 'shared'

interface Props {
  filter: TripsFilter
}

export function TripsList({ filter }: Props) {
  const t = useTranslations('trips.list')
  const tHome = useTranslations('trips.home')
  const router = useRouter()
  const { colors, fonts, spacing, borderRadius } = useTheme()
  const {
    data: trips = [],
    isLoading: tripsLoading,
    isError: tripsError,
    refetch: refetchTrips,
  } = useTrips()
  const {
    data: allMemories = [],
    isLoading: memoriesLoading,
    isError: memoriesError,
    refetch: refetchMemories,
  } = useAllMemories()
  const { data: user } = useUser()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        list: { width: '100%' },
        quota: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[4],
          marginTop: spacing[5],
          borderRadius: borderRadius.xl + spacing[2],
          backgroundColor: colors.secondary,
          padding: spacing[5],
        },
        quotaText: { flex: 1 },
        quotaLabel: {
          fontFamily: fonts.mono,
          fontSize: 10.5,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          color: colors.secondaryForeground,
        },
        track: {
          height: 5,
          borderRadius: borderRadius.full,
          backgroundColor: `${colors.foreground}24`,
          marginTop: spacing[2] + 2,
          overflow: 'hidden',
        },
        fill: { height: '100%', borderRadius: borderRadius.full, backgroundColor: colors.primary },
      }),
    [colors, fonts, spacing, borderRadius],
  )

  if (tripsLoading || memoriesLoading) {
    return <TripsListSkeleton />
  }

  if (tripsError || memoriesError) {
    return (
      <ErrorBanner
        message={t('trips_error')}
        onRetry={() => {
          refetchTrips()
          refetchMemories()
        }}
      />
    )
  }

  if (trips.length === 0) {
    return <NoTripsEmpty />
  }

  const tripsWithDerived = trips.map((trip) => {
    const tripMemories = allMemories.filter((memory) => memory.tripId === trip.id)
    const { uniqueCities } = getUniqueCities({ allMemories: tripMemories })
    return {
      trip,
      meta: tHome('continue_meta', {
        dateRange: formatDateRange(trip.startDate, trip.endDate),
        count: tripMemories.length,
      }),
      sub: [...uniqueCities].join(', '),
      isShared: tripMemories.some((memory) => memory.isPublic),
    }
  })

  const filtered = tripsWithDerived.filter(({ isShared }) => {
    if (filter === 'private') return !isShared
    if (filter === 'shared') return isShared
    return true
  })

  const slots = user ? getTripSlots(user.plan, trips.length) : null

  return (
    <Animated.View entering={FadeIn.duration(200)} style={styles.list}>
      {filtered.map(({ trip, meta, sub, isShared }, index) => (
        <TripRow
          key={trip.id}
          trip={trip}
          meta={meta}
          sub={sub}
          isShared={isShared}
          showDivider={index < filtered.length - 1}
          onPress={() => router.push(`/(app)/trips/${trip.id}`)}
        />
      ))}
      {slots && !slots.isUnlimited && (
        <View style={styles.quota}>
          <View style={styles.quotaText}>
            <Text style={styles.quotaLabel}>
              {t('quota_label', { count: slots.used, limit: slots.limit ?? 0 })}
            </Text>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  { width: `${Math.min(100, (slots.used / (slots.limit ?? 1)) * 100)}%` },
                ]}
              />
            </View>
          </View>
          <Button size="sm" onPress={() => router.push(paywallRoute('trips'))}>
            {t('quota_cta')}
          </Button>
        </View>
      )}
    </Animated.View>
  )
}
