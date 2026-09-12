import { colors as brandColors } from '@passe/theme'
import { formatDateRange } from '@passe/utils'
import { Image } from 'expo-image'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'

import { Badge } from '@/components/ui/badge'
import { LinearGradient } from '@/components/ui/linear-gradient'
import { PressableScale } from '@/components/ui/pressable-scale'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { enterUp } from '@/lib/motion'

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
  entranceDelay?: number
  /** Scrapbook tilt in degrees at rest — straightens while pressed */
  tilt?: number
}

// The scrim sits on a photo, so it uses fixed brand inks rather than
// mode-dependent semantic colors (light text over a dark fade in both modes).
const espresso = brandColors.darkEspresso.DEFAULT
const cream = brandColors.agedCream.DEFAULT
const sandyBeige = brandColors.sandyBeige.DEFAULT
const terracotta = brandColors.terracotta.DEFAULT

export function TripCard({ trip, onPress, entranceDelay = 0, tilt = 0 }: TripCardProps) {
  const t = useTranslations('trips.card')
  const { colors, fonts, spacing, fontSizes, fontWeights, borderRadius } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        // Card keeps `overflow: hidden` (to clip the cover to rounded corners), which on
        // iOS would clip a shadow — so the shadow lives on this outer wrapper instead.
        shadow: {
          borderRadius: borderRadius.xl,
          backgroundColor: colors.background,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.16,
          shadowRadius: 12,
          elevation: 5,
        },
        card: {
          aspectRatio: 4 / 3,
          borderRadius: borderRadius.xl,
          overflow: 'hidden',
          backgroundColor: colors.muted,
        },
        cover: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
        coverFallback: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
        },
        coverFallbackInitial: {
          fontFamily: fonts.display,
          fontSize: fontSizes['5xl'],
          fontWeight: fontWeights.bold,
          color: `${espresso}59`,
        },
        scrim: { position: 'absolute', left: 0, right: 0, bottom: 0 },
        // Extends above the text band so the darkening fades in gradually
        scrimFade: {
          position: 'absolute',
          left: 0,
          right: 0,
          top: -spacing[16],
          bottom: 0,
        },
        content: { padding: spacing[4], gap: spacing[1] },
        title: {
          fontFamily: fonts.display,
          fontSize: fontSizes.lg,
          fontWeight: fontWeights.semibold,
          color: cream,
          textShadowColor: 'rgba(0, 0, 0, 0.6)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 3,
        },
        date: {
          fontSize: fontSizes.sm,
          color: `${cream}D9`,
          textShadowColor: 'rgba(0, 0, 0, 0.6)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        },
        badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] - 2, paddingTop: 2 },
        stampChip: { borderColor: `${cream}B3` },
        stampLabel: { color: cream },
      }),
    [colors, fonts, spacing, fontSizes, fontWeights, borderRadius],
  )

  const card = (
    <View style={styles.card}>
      {trip.coverImageUrl ? (
        <Image
          source={{ uri: trip.coverImageUrl }}
          style={styles.cover}
          contentFit="cover"
          accessibilityLabel={t('cover_alt', { title: trip.title })}
        />
      ) : (
        <View style={styles.coverFallback} pointerEvents="none">
          <LinearGradient
            colors={[sandyBeige, cream, `${terracotta}4D`]}
            style={styles.cover}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Text style={styles.coverFallbackInitial}>{trip.title.trim().charAt(0)}</Text>
        </View>
      )}

      <View style={styles.scrim} pointerEvents="none">
        <LinearGradient
          colors={[`${espresso}00`, `${espresso}80`, `${espresso}D9`]}
          style={styles.scrimFade}
        />
        <View style={styles.content}>
          <Text style={styles.title}>{trip.title}</Text>
          <Text style={styles.date}>{formatDateRange(trip.startDate, trip.endDate)}</Text>
          {trip.countries.length > 0 && (
            <View style={styles.badges}>
              {trip.countries.map((country) => (
                <Badge
                  key={country}
                  variant="stamp"
                  style={styles.stampChip}
                  labelStyle={styles.stampLabel}
                >
                  {country}
                </Badge>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  )

  if (onPress) {
    return (
      <Animated.View entering={enterUp(entranceDelay)}>
        <PressableScale
          onPress={onPress}
          restRotation={tilt}
          containerStyle={styles.shadow}
          accessibilityRole="button"
          accessibilityLabel={trip.title}
        >
          {card}
        </PressableScale>
      </Animated.View>
    )
  }

  return (
    <Animated.View
      entering={enterUp(entranceDelay)}
      style={[styles.shadow, tilt !== 0 && { transform: [{ rotate: `${tilt}deg` }] }]}
    >
      {card}
    </Animated.View>
  )
}
