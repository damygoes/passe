import { colors as brandColors } from '@passe/theme'
import { formatDateRange } from '@passe/utils'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

interface TripDetailInfoCardTrip {
  id: string
  title: string
  startDate: Date | string
  endDate: Date | string
}

interface TripDetailInfoCardProps {
  trip: TripDetailInfoCardTrip
  cities: string[]
  isShared: boolean
}

export function TripDetailInfoCard({ trip, cities, isShared }: TripDetailInfoCardProps) {
  const t = useTranslations('trips.detail')
  const tHome = useTranslations('trips.home')
  const router = useRouter()
  const { colors, fonts, spacing, fontSizes, borderRadius } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          marginTop: -42,
          marginHorizontal: spacing[4],
          borderRadius: borderRadius.xl + spacing[2],
          backgroundColor: colors.popover,
          padding: spacing[5],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.14,
          shadowRadius: 16,
          elevation: 6,
        },
        date: {
          fontFamily: fonts.mono,
          fontSize: 10.5,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: colors.mutedForeground,
        },
        title: {
          fontFamily: fonts.display,
          fontSize: fontSizes['4xl'],
          lineHeight: 40,
          color: colors.foreground,
          marginTop: spacing[2],
        },
        tags: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing[2],
          marginTop: spacing[3] + 2,
        },
        buttons: { flexDirection: 'row', gap: spacing[3], marginTop: spacing[4] + 2 },
        button: { flex: 1 },
        caption: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing[2],
          marginTop: spacing[3] + 2,
        },
        dot: {
          width: 7,
          height: 7,
          borderRadius: 4,
          backgroundColor: isShared ? colors.primary : brandColors.deepOlive.DEFAULT,
        },
        captionLabel: {
          fontFamily: fonts.mono,
          fontSize: 9.5,
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: colors.mutedForeground,
        },
      }),
    [colors, fonts, spacing, fontSizes, borderRadius, isShared],
  )

  return (
    <View style={styles.card}>
      <Text style={styles.date}>{formatDateRange(trip.startDate, trip.endDate)}</Text>
      <Text style={styles.title}>{trip.title}</Text>
      {cities.length > 0 && (
        <View style={styles.tags}>
          {cities.map((city) => (
            <Badge key={city} variant="private">
              {city}
            </Badge>
          ))}
        </View>
      )}
      <View style={styles.buttons}>
        <Button
          style={styles.button}
          onPress={() => router.push(`/(app)/trips/new-memory/${trip.id}`)}
        >
          {t('add_memory')}
        </Button>
        {!isShared && (
          <Button
            variant="secondary"
            style={styles.button}
            onPress={() => router.push('/(app)/account/portfolio')}
          >
            {t('share')}
          </Button>
        )}
      </View>
      <View style={styles.caption}>
        <View style={styles.dot} />
        <Text style={styles.captionLabel}>
          {isShared ? tHome('shared_tag') : tHome('private_tag')}
        </Text>
      </View>
    </View>
  )
}
