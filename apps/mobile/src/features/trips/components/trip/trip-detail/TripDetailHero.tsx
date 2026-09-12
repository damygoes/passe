import { colors as brandColors } from '@passe/theme'
import { formatTripDateFull } from '@passe/utils'
import { Image } from 'expo-image'
import { useMemo } from 'react'
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated'

import { Badge } from '@/components/ui/badge'
import { LinearGradient } from '@/components/ui/linear-gradient'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { TRIP_DETAIL_NAV_BAR_HEIGHT } from './TripDetailNavBar'

interface TripDetailHeroTrip {
  title: string
  startDate: Date | string
  endDate: Date | string
  countries: string[]
  coverImageUrl?: string | null
}

interface TripDetailHeroProps {
  trip: TripDetailHeroTrip
  /** Normalized scroll offset of the detail screen (0 at rest) — drives stretch/parallax */
  scrollY: SharedValue<number>
}

// Overlay inks sit on a photo, so they use fixed brand colors rather than
// mode-dependent semantic colors (same rationale as TripCard's scrim).
const espresso = brandColors.darkEspresso.DEFAULT
const cream = brandColors.agedCream.DEFAULT
const sandyBeige = brandColors.sandyBeige.DEFAULT
const terracotta = brandColors.terracotta.DEFAULT

// Full-bleed hero: edge-to-edge cover under the transparent nav bar, with the
// trip title/dates/countries overlaid on a bottom scrim. Pulling down past the
// top stretches the photo; scrolling up parallaxes it away.
export function TripDetailHero({ trip, scrollY }: TripDetailHeroProps) {
  const t = useTranslations('trips.card')
  const { spacing, fonts, fontSizes, fontWeights, borderRadius } = useTheme()
  const { height: windowHeight } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const heroHeight = Math.round(windowHeight * 0.42)

  // Pull-down rubber-band only: pin the top edge and zoom the whole hero.
  // Identity at rest and while scrolling up, so the overlay text never shifts.
  const stretchStyle = useAnimatedStyle(() => {
    const y = Math.min(scrollY.value, 0)
    return {
      transform: [{ translateY: y / 2 }, { scale: 1 - y / heroHeight }],
    }
  })

  // Scroll-up parallax on the image layer only, inside the clipped hero frame —
  // the frame itself scrolls away normally, so it can never overlap the
  // content band below it.
  const parallaxStyle = useAnimatedStyle(() => {
    const y = Math.max(scrollY.value, 0)
    return {
      transform: [{ translateY: interpolate(y, [0, heroHeight], [0, heroHeight * 0.35]) }],
    }
  })

  const styles = useMemo(
    () =>
      StyleSheet.create({
        hero: { width: '100%', height: heroHeight, overflow: 'hidden' },
        fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
        fallback: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
        },
        fallbackInitial: {
          fontFamily: fonts.display,
          fontSize: fontSizes['5xl'],
          fontWeight: fontWeights.bold,
          color: `${espresso}59`,
        },
        topFade: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: insets.top + TRIP_DETAIL_NAV_BAR_HEIGHT + spacing[8],
        },
        scrim: { position: 'absolute', left: 0, right: 0, bottom: 0 },
        scrimFade: {
          position: 'absolute',
          left: 0,
          right: 0,
          top: -spacing[16],
          bottom: 0,
        },
        overlay: {
          paddingHorizontal: spacing[4],
          paddingBottom: spacing[4],
          gap: spacing[1],
        },
        title: {
          fontFamily: fonts.display,
          fontSize: fontSizes['3xl'],
          fontWeight: fontWeights.semibold,
          color: cream,
          textShadowColor: 'rgba(0, 0, 0, 0.6)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 3,
        },
        dates: {
          fontSize: fontSizes.sm,
          color: `${cream}D9`,
          textShadowColor: 'rgba(0, 0, 0, 0.6)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        },
        badges: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing[2] - 2,
          paddingTop: spacing[1],
        },
        stampChip: { borderColor: `${cream}B3`, borderRadius: borderRadius.lg },
        stampLabel: { color: cream },
      }),
    [heroHeight, insets.top, spacing, fonts, fontSizes, fontWeights, borderRadius],
  )

  return (
    <Animated.View style={[styles.hero, stretchStyle]}>
      <Animated.View style={[styles.fill, parallaxStyle]}>
        {trip.coverImageUrl ? (
          <Image
            source={{ uri: trip.coverImageUrl }}
            style={styles.fill}
            contentFit="cover"
            accessibilityLabel={t('cover_alt', { title: trip.title })}
          />
        ) : (
          <View style={styles.fallback} pointerEvents="none">
            <LinearGradient
              colors={[sandyBeige, cream, `${terracotta}4D`]}
              style={styles.fill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Text style={styles.fallbackInitial}>{trip.title.trim().charAt(0)}</Text>
          </View>
        )}
      </Animated.View>

      {/* Contrast for the nav-bar buttons floating over the photo */}
      <LinearGradient colors={[`${espresso}66`, `${espresso}00`]} style={styles.topFade} />

      <View style={styles.scrim} pointerEvents="none">
        <LinearGradient
          colors={[`${espresso}00`, `${espresso}80`, `${espresso}D9`]}
          style={styles.scrimFade}
        />
        <View style={styles.overlay}>
          <Text style={styles.title}>{trip.title}</Text>
          <Text style={styles.dates}>
            {formatTripDateFull(trip.startDate)} – {formatTripDateFull(trip.endDate)}
          </Text>
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
    </Animated.View>
  )
}
