import { useMemories, useTrip } from '@passe/hooks'
import { getUniqueCities } from '@passe/utils'
import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { SharedValue } from 'react-native-reanimated'

import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { TripDetailHeaderSkeleton } from './TripDetailHeaderSkeleton'
import { TripDetailHero } from './TripDetailHero'
import { TripDetailInfoCard } from './TripDetailInfoCard'
import { TRIP_DETAIL_NAV_BAR_HEIGHT } from './TripDetailNavBar'

interface TripDetailHeaderProps {
  id: string
  /** Screen scroll offset — forwarded to the hero for stretch/parallax */
  scrollY: SharedValue<number>
}

// Full-bleed hero (plain cover photo) + an overlapping info card (dates,
// title, city tags, actions, private/shared caption). Actions (export/edit/
// delete) live in the nav bar's ⋯ sheet.
export function TripDetailHeader({ id, scrollY }: TripDetailHeaderProps) {
  const t = useTranslations('trips.detail')
  const { data: trip, isLoading: tripLoading, isError: tripError } = useTrip(id)
  const { data: memories = [], isLoading: memoriesLoading } = useMemories(id)
  const { spacing } = useTheme()
  const insets = useSafeAreaInsets()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        // No hero exists in the error state, so clear the floating nav bar manually
        errorWrapper: {
          paddingTop: insets.top + TRIP_DETAIL_NAV_BAR_HEIGHT + spacing[4],
          paddingHorizontal: spacing[4],
        },
      }),
    [spacing, insets.top],
  )

  if (tripLoading || memoriesLoading) return <TripDetailHeaderSkeleton />

  if (tripError || !trip) {
    return (
      <View style={styles.errorWrapper}>
        <ErrorBanner message={t('trip_error')} />
      </View>
    )
  }

  const { uniqueCities } = getUniqueCities({ allMemories: memories })
  const isShared = memories.some((memory) => memory.isPublic)

  return (
    <View>
      <TripDetailHero trip={trip} scrollY={scrollY} />
      <TripDetailInfoCard trip={trip} cities={[...uniqueCities]} isShared={isShared} />
    </View>
  )
}
