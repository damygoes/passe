import { useTrip } from '@passe/hooks'
import { formatTripDateFull } from '@passe/utils'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  PageHeader,
  PageHeaderAction,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/components/ui/page-header'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { TripDetailHeaderSkeleton } from './TripDetailHeaderSkeleton'

interface TripDetailHeaderProps {
  id: string
}

export function TripDetailHeader({ id }: TripDetailHeaderProps) {
  const t = useTranslations('trips.detail')
  const router = useRouter()
  const { data: trip, isLoading, isError } = useTrip(id)
  const { colors, spacing, fontSizes, borderRadius } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { gap: spacing[4] },
        headerText: { flex: 1, gap: spacing[1] },
        badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[1] },
        cover: { width: '100%', aspectRatio: 16 / 9, borderRadius: borderRadius.xl },
        description: { fontSize: fontSizes.base, color: colors.mutedForeground },
      }),
    [colors, spacing, fontSizes, borderRadius],
  )

  if (isLoading) return <TripDetailHeaderSkeleton />

  if (isError || !trip) return <ErrorBanner message={t('trip_error')} />

  return (
    <View style={styles.container}>
      <PageHeader>
        <View style={styles.headerText}>
          <PageHeaderTitle>{trip.title}</PageHeaderTitle>
          <PageHeaderDescription>
            {formatTripDateFull(trip.startDate)} – {formatTripDateFull(trip.endDate)}
          </PageHeaderDescription>
        </View>
        <PageHeaderAction>
          <Button variant="secondary" size="sm" onPress={() => router.push(`/(app)/trips/edit/${id}`)}>
            {t('edit')}
          </Button>
        </PageHeaderAction>
      </PageHeader>

      {trip.countries.length > 0 && (
        <View style={styles.badges}>
          {trip.countries.map((country) => (
            <Badge key={country} variant="outline">
              {country}
            </Badge>
          ))}
        </View>
      )}

      {trip.coverImageUrl && (
        <Image
          source={{ uri: trip.coverImageUrl }}
          style={styles.cover}
          contentFit="cover"
          accessibilityLabel={trip.title}
        />
      )}

      {trip.description && <Text style={styles.description}>{trip.description}</Text>}
    </View>
  )
}
