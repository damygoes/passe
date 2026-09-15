import { useAllMemories, useTrips } from '@passe/hooks'
import { formatDateRange, getMostRecentTrip, getUniqueCities } from '@passe/utils'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Badge } from '@/components/ui/badge'
import { PressableScale } from '@/components/ui/pressable-scale'
import { Skeleton } from '@/components/ui/skeleton'
import { NoTripsEmpty } from '@/features/trips/components/trip/empty/NoTripsEmpty'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

export function ContinueTripCardDataWrapper() {
  const t = useTranslations('trips.home')
  const router = useRouter()
  const { colors, fonts, spacing, fontSizes, borderRadius } = useTheme()
  const { data: trips = [], isLoading: tripsLoading, isError: tripsError } = useTrips()
  const {
    data: allMemories = [],
    isLoading: memoriesLoading,
    isError: memoriesError,
  } = useAllMemories()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        shadow: {
          borderRadius: borderRadius.xl + spacing[2],
          backgroundColor: colors.background,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.12,
          shadowRadius: 14,
          elevation: 4,
        },
        card: {
          borderRadius: borderRadius.xl + spacing[2],
          overflow: 'hidden',
          backgroundColor: colors.popover,
        },
        cover: { height: 196, width: '100%', backgroundColor: colors.muted },
        content: { padding: spacing[5] },
        titleRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
        title: { fontFamily: fonts.display, fontSize: fontSizes['2xl'], color: colors.foreground },
        meta: {
          fontFamily: fonts.mono,
          fontSize: 11,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          color: colors.mutedForeground,
          marginTop: spacing[2],
        },
        description: {
          fontSize: fontSizes.sm,
          color: colors.mutedForeground,
          marginTop: spacing[3],
          lineHeight: 20,
        },
        skeleton: { height: 320, width: '100%', borderRadius: borderRadius.xl + spacing[2] },
      }),
    [colors, fonts, spacing, fontSizes, borderRadius],
  )

  if (tripsLoading || memoriesLoading) {
    return <Skeleton style={styles.skeleton} />
  }

  if (tripsError || memoriesError) return null
  if (trips.length === 0) return <NoTripsEmpty />

  const trip = getMostRecentTrip(trips)
  if (!trip) return null

  const tripMemories = allMemories.filter((memory) => memory.tripId === trip.id)
  const isShared = tripMemories.some((memory) => memory.isPublic)
  const { uniqueCities } = getUniqueCities({ allMemories: tripMemories })
  const notelessCount = tripMemories.filter((memory) => !memory.note?.trim()).length
  const description = [
    [...uniqueCities].join(', '),
    t('noteless_memories', { count: notelessCount }),
  ]
    .filter(Boolean)
    .join('. ')

  return (
    <View style={styles.shadow}>
      <PressableScale onPress={() => router.push(`/(app)/trips/${trip.id}`)}>
        <View style={styles.card}>
          {trip.coverImageUrl ? (
            <Image source={{ uri: trip.coverImageUrl }} style={styles.cover} contentFit="cover" />
          ) : (
            <View style={styles.cover} />
          )}
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{trip.title}</Text>
              <Badge variant={isShared ? 'shared' : 'private'}>
                {isShared ? t('shared_tag') : t('private_tag')}
              </Badge>
            </View>
            <Text style={styles.meta}>
              {t('continue_meta', {
                dateRange: formatDateRange(trip.startDate, trip.endDate),
                count: tripMemories.length,
              })}
            </Text>
            {description ? <Text style={styles.description}>{description}</Text> : null}
          </View>
        </View>
      </PressableScale>
    </View>
  )
}
