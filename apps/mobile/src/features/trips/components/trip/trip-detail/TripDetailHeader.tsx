import { useTrip } from '@passe/hooks'
import { useHeaderHeight } from 'expo-router/react-navigation'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import type { SharedValue } from 'react-native-reanimated'

import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { TripDetailHeaderSkeleton } from './TripDetailHeaderSkeleton'
import { TripDetailHero } from './TripDetailHero'

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
  const headerHeight = useHeaderHeight()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        // No hero exists in the error state, so clear the transparent nav bar manually
        errorWrapper: {
          paddingTop: headerHeight + spacing[4],
          paddingHorizontal: spacing[4],
        },
        description: {
          paddingHorizontal: spacing[4],
          paddingTop: spacing[4],
          fontSize: fontSizes.base,
          color: colors.mutedForeground,
        },
      }),
    [colors, spacing, fontSizes, headerHeight],
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
