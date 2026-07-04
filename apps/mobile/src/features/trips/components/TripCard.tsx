import { formatDateRange } from '@passe/utils'
import { Image } from 'expo-image'
import { useMemo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
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
  const { colors, spacing, fontSizes, borderRadius } = useTheme()

  const resolvedCoverImageUrl =
    trip.coverImageUrl ??
    'https://images.unsplash.com/photo-1656066848895-30feffe87ed6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJpcCUyMHBsYWNlaG9sZGVyfGVufDB8fDB8fHwy'

  const styles = useMemo(
    () =>
      StyleSheet.create({
        // Card keeps `overflow: hidden` (to clip the cover to rounded corners), which on
        // iOS would clip a shadow — so the shadow lives on this outer wrapper instead.
        cardShadow: {
          borderRadius: borderRadius.xl,
          backgroundColor: colors.popover,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 2,
        },
        cardSurface: { borderWidth: 0, backgroundColor: colors.popover },
        cover: { width: '100%', aspectRatio: 16 / 9 },
        headerText: { flex: 1, gap: spacing[1] },
        badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[1] },
        footer: { justifyContent: 'space-between' },
        footerText: { fontSize: fontSizes.sm, fontWeight: '500', color: colors.foreground },
        pressed: { opacity: 0.9 },
      }),
    [colors, spacing, fontSizes, borderRadius],
  )

  const card = (
    <Card style={styles.cardSurface}>
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
      {onPress && (
        <CardFooter style={styles.footer}>
          <Text style={styles.footerText}>{t('view')}</Text>
          <Icon name="chevron-right" size="sm" color={colors.mutedForeground} />
        </CardFooter>
      )}
    </Card>
  )

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={trip.title}
        style={({ pressed }) => [styles.cardShadow, pressed && styles.pressed]}
      >
        {card}
      </Pressable>
    )
  }

  return <View style={styles.cardShadow}>{card}</View>
}
