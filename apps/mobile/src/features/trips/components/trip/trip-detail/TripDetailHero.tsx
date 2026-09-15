import { colors as brandColors } from '@passe/theme'
import { Image } from 'expo-image'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated'
import Animated from 'react-native-reanimated'

import { LinearGradient } from '@/components/ui/linear-gradient'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { TRIP_DETAIL_NAV_BAR_HEIGHT } from './TripDetailNavBar'

interface TripDetailHeroTrip {
  title: string
  coverImageUrl?: string | null
}

interface TripDetailHeroProps {
  trip: TripDetailHeroTrip
  /** Normalized scroll offset of the detail screen (0 at rest) — drives stretch/parallax */
  scrollY: SharedValue<number>
}

const HERO_HEIGHT = 270

// Overlay inks sit on a photo, so they use fixed brand colors rather than
// mode-dependent semantic colors (same rationale as TripCard's scrim).
const espresso = brandColors.darkEspresso.DEFAULT
const cream = brandColors.agedCream.DEFAULT
const sandyBeige = brandColors.sandyBeige.DEFAULT
const terracotta = brandColors.terracotta.DEFAULT

// Plain full-bleed cover under the transparent nav bar — no text overlay, the
// title/dates/tags live in the overlapping info card below instead. Pulling
// down past the top stretches the photo; scrolling up parallaxes it away.
export function TripDetailHero({ trip, scrollY }: TripDetailHeroProps) {
  const t = useTranslations('trips.card')
  const { spacing, fonts, fontSizes, fontWeights } = useTheme()
  const insets = useSafeAreaInsets()

  const stretchStyle = useAnimatedStyle(() => {
    const y = Math.min(scrollY.value, 0)
    return {
      transform: [{ translateY: y / 2 }, { scale: 1 - y / HERO_HEIGHT }],
    }
  })

  const parallaxStyle = useAnimatedStyle(() => {
    const y = Math.max(scrollY.value, 0)
    return {
      transform: [{ translateY: interpolate(y, [0, HERO_HEIGHT], [0, HERO_HEIGHT * 0.35]) }],
    }
  })

  const styles = useMemo(
    () =>
      StyleSheet.create({
        // Stretches the whole block up by the status-bar inset (and grows by the
        // same amount) so the photo bleeds all the way to the physical top of the
        // screen — the trip-detail Stack screen hides its header entirely (see
        // TripDetailNavBar), which otherwise leaves the safe-area gap visible
        // above the cover instead of photo.
        hero: {
          width: '100%',
          height: HERO_HEIGHT + insets.top,
          marginTop: -insets.top,
          overflow: 'hidden',
        },
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
      }),
    [insets.top, spacing, fonts, fontSizes, fontWeights],
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
    </Animated.View>
  )
}
