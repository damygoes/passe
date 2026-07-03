import { formatDateRange } from '@passe/utils'
import { Image } from 'expo-image'
import { useMemo } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

interface TripCardData {
  id: string
  title: string
  startDate: Date | string
  endDate: Date | string
  countries: string[]
  coverImageUrl?: string | null
}

interface TripCardProps {
  trip: TripCardData
  onPress?: () => void
}

export function TripCard({ trip, onPress }: TripCardProps) {
  const t = useTranslations('trips.card')
  const { spacing } = useTheme()

  const resolvedCoverImageUrl =
    trip.coverImageUrl ??
    'https://images.unsplash.com/photo-1656066848895-30feffe87ed6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJpcCUyMHBsYWNlaG9sZGVyfGVufDB8fDB8fHwy'

  const styles = useMemo(
    () =>
      StyleSheet.create({
        cover: { width: '100%', aspectRatio: 16 / 9 },
        headerText: { flex: 1, gap: spacing[1] },
        badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[1] },
        pressed: { opacity: 0.9 },
      }),
    [spacing],
  )

  const card = (
    <Card>
      <Image
        source={{ uri: resolvedCoverImageUrl }}
        style={styles.cover}
        contentFit="cover"
        accessibilityLabel={t('cover_alt', { title: trip.title })}
      />

      <CardHeader>
        <View style={styles.headerText}>
          <CardTitle>{trip.title}</CardTitle>
          <CardDescription>{formatDateRange(trip.startDate, trip.endDate)}</CardDescription>
        </View>
      </CardHeader>
      {trip.countries.length > 0 && (
        <CardContent>
          <View style={styles.badges}>
            {trip.countries.map((country) => (
              <Badge key={country} variant="outline">
                {country}
              </Badge>
            ))}
          </View>
        </CardContent>
      )}
    </Card>
  )

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={trip.title}
        style={({ pressed }) => (pressed ? styles.pressed : undefined)}
      >
        {card}
      </Pressable>
    )
  }

  return card
}
