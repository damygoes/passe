import { formatDateRange } from '@passe/utils'
import { Image } from 'expo-image'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Icon } from '@/components/ui/icon'
import { PressableScale } from '@/components/ui/pressable-scale'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

interface PortfolioTripCardData {
  id: string
  title: string
  startDate: Date | string
  endDate: Date | string
  coverImageUrl?: string | null
}

interface PortfolioTripCardProps {
  trip: PortfolioTripCardData
  onPress: () => void
}

export function PortfolioTripCard({ trip, onPress }: PortfolioTripCardProps) {
  const t = useTranslations('trips.card')
  const { colors, fonts, spacing, fontSizes } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        cover: {
          height: 200,
          borderRadius: 26,
          overflow: 'hidden',
          backgroundColor: colors.secondary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        image: { width: '100%', height: '100%' },
        title: {
          fontFamily: fonts.display,
          fontSize: fontSizes['2xl'],
          color: colors.foreground,
          marginTop: spacing[3],
        },
        date: {
          fontSize: fontSizes.xs,
          letterSpacing: 1,
          color: colors.mutedForeground,
          textTransform: 'uppercase',
          marginTop: spacing[1],
        },
      }),
    [colors, fonts, spacing, fontSizes],
  )

  return (
    <PressableScale onPress={onPress} accessibilityRole="button" accessibilityLabel={trip.title}>
      <View style={styles.cover}>
        {trip.coverImageUrl ? (
          <Image
            source={{ uri: trip.coverImageUrl }}
            style={styles.image}
            contentFit="cover"
            accessibilityLabel={t('cover_alt', { title: trip.title })}
          />
        ) : (
          <Icon name="camera" size="xl" color={`${colors.foreground}40`} />
        )}
      </View>
      <Text style={styles.title}>{trip.title}</Text>
      <Text style={styles.date}>{formatDateRange(trip.startDate, trip.endDate)}</Text>
    </PressableScale>
  )
}
