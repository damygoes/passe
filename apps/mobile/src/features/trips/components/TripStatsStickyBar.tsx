import { useMemo } from 'react'
import { StyleSheet, Text } from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated'
import type { SharedValue } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

interface TripStatsStickyBarProps {
  countriesCount: number
  citiesCount: number
  yearsCount: number
  /** Scroll offset of the trips list, driven by the screen's scroll handler */
  scrollY: SharedValue<number>
  /** Content offset at which the stats cards have fully left the viewport */
  threshold: SharedValue<number>
}

/**
 * Compact recap of the trip stats that fades in at the top of the screen once
 * the stat cards scroll out of view. Purely informational — never intercepts
 * touches.
 */
export function TripStatsStickyBar({
  countriesCount,
  citiesCount,
  yearsCount,
  scrollY,
  threshold,
}: TripStatsStickyBarProps) {
  const t = useTranslations('trips.stats')
  const { colors, spacing, fontSizes, fontWeights } = useTheme()
  const insets = useSafeAreaInsets()

  const recap = [
    `${countriesCount} ${t('countries', { count: countriesCount })}`,
    `${citiesCount} ${t('cities', { count: citiesCount })}`,
    `${yearsCount} ${t('years', { count: yearsCount })}`,
  ].join(' · ')

  const animatedStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      scrollY.value,
      [threshold.value, threshold.value + 40],
      [0, 1],
      Extrapolation.CLAMP,
    )
    return {
      opacity: progress,
      transform: [{ translateY: interpolate(progress, [0, 1], [-12, 0]) }],
    }
  })

  const styles = useMemo(
    () =>
      StyleSheet.create({
        bar: {
          // Absolute positioning ignores the SafeAreaView's top padding, so
          // the status-bar inset must be applied explicitly
          position: 'absolute',
          top: insets.top,
          left: 0,
          right: 0,
          zIndex: 10,
          alignItems: 'center',
          backgroundColor: colors.background,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
          paddingVertical: spacing[2],
          paddingHorizontal: spacing[4],
        },
        text: {
          fontSize: fontSizes.sm,
          fontWeight: fontWeights.medium,
          color: colors.foreground,
        },
      }),
    [colors, spacing, fontSizes, fontWeights, insets.top],
  )

  return (
    <Animated.View style={[styles.bar, animatedStyle]} pointerEvents="none">
      <Text style={styles.text}>{recap}</Text>
    </Animated.View>
  )
}
