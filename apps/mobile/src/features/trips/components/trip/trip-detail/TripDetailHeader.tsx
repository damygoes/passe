import { useTrip } from '@passe/hooks'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { SharedValue } from 'react-native-reanimated'

import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { TripDetailHeaderSkeleton } from './TripDetailHeaderSkeleton'
import { TripDetailHero } from './TripDetailHero'
import { TRIP_DETAIL_NAV_BAR_HEIGHT } from './TripDetailNavBar'

interface TripDetailHeaderProps {
  id: string
  /** Screen scroll offset — forwarded to the hero for stretch/parallax */
  scrollY: SharedValue<number>
}

// Full-bleed hero (title/dates/badges overlaid on the cover) + description
// band. Actions (export/edit/delete) live in the nav bar's ⋯ sheet.
export function TripDetailHeader({ id, scrollY }: TripDetailHeaderProps) {
  const t = useTranslations('trips.detail')
  const { data: trip, isLoading, isError } = useTrip(id)
  const { colors, spacing, fontSizes } = useTheme()
  const insets = useSafeAreaInsets()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        // No hero exists in the error state, so clear the floating nav bar manually
        errorWrapper: {
          paddingTop: insets.top + TRIP_DETAIL_NAV_BAR_HEIGHT + spacing[4],
          paddingHorizontal: spacing[4],
        },
        description: {
          paddingHorizontal: spacing[4],
          paddingTop: spacing[4],
          fontSize: fontSizes.base,
          color: colors.mutedForeground,
        },
      }),
    [colors, spacing, fontSizes, insets.top],
  )

  if (isLoading) return <TripDetailHeaderSkeleton />

  if (isError || !trip) {
    return (
      <View style={styles.errorWrapper}>
        <ErrorBanner message={t('trip_error')} />
      </View>
    )
  }

  return (
    <View>
      <TripDetailHero trip={trip} scrollY={scrollY} />
      {trip.description && <Text style={styles.description}>{trip.description}</Text>}
    </View>
  )
}
