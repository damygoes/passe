import { StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native'

import type { AppTheme } from '@/hooks/useTheme'

interface PhotoCarouselRecipe {
  hero: {
    container: ViewStyle
    image: ImageStyle
    washOverlay: ViewStyle
  }
  countPill: {
    container: ViewStyle
    label: TextStyle
  }
  dots: {
    base: ViewStyle
    activeWidth: number
    inactiveWidth: number
  }
  thumbnail: {
    base: ViewStyle
    activeRing: ViewStyle
    inactive: ImageStyle
    addTile: ViewStyle
    addLabel: TextStyle
  }
  tapZone: ViewStyle
}

// RN doesn't reliably support the CSS `filter` web's `.washed` treatment
// uses on this Expo/RN version (no existing usage anywhere in the
// codebase) — approximated here with a reduced image opacity plus a warm,
// low-opacity dark overlay instead of true desaturation/contrast filters.
export function createPhotoCarouselRecipe(theme: AppTheme): PhotoCarouselRecipe {
  const { colors, palette, spacing, borderRadius, fonts } = theme

  return {
    hero: {
      container: StyleSheet.create({
        style: {
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          backgroundColor: palette.darkEspresso.dark,
        },
      }).style,
      image: StyleSheet.create({
        style: { width: '100%', height: '100%', opacity: 0.95 },
      }).style,
      washOverlay: StyleSheet.create({
        style: { backgroundColor: palette.darkEspresso.DEFAULT, opacity: 0.06 },
      }).style,
    },
    countPill: {
      container: StyleSheet.create({
        style: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[1] + 1,
          borderRadius: borderRadius.full,
          paddingHorizontal: spacing[3] + 3,
          paddingVertical: spacing[2] + 1,
          backgroundColor: `${palette.darkEspresso.DEFAULT}8C`,
          overflow: 'hidden',
        },
      }).style,
      label: StyleSheet.create({
        style: {
          fontFamily: fonts.mono,
          fontSize: 12,
          letterSpacing: 1,
          color: palette.agedCream.DEFAULT,
        },
      }).style,
    },
    dots: {
      base: StyleSheet.create({
        style: { height: 6, borderRadius: 3, backgroundColor: palette.agedCream.DEFAULT },
      }).style,
      activeWidth: 18,
      inactiveWidth: 6,
    },
    thumbnail: {
      base: StyleSheet.create({
        style: { width: 62, height: 62, borderRadius: borderRadius.lg, overflow: 'hidden' },
      }).style,
      activeRing: StyleSheet.create({
        style: { borderWidth: 2, borderColor: colors.primary },
      }).style,
      inactive: StyleSheet.create({ style: { opacity: 0.6 } }).style,
      addTile: StyleSheet.create({
        style: {
          width: 62,
          height: 62,
          borderRadius: borderRadius.lg,
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: palette.terracotta[300],
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        },
      }).style,
      addLabel: StyleSheet.create({
        style: {
          fontFamily: fonts.mono,
          fontSize: 7.5,
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: palette.terracotta[700],
        },
      }).style,
    },
    tapZone: StyleSheet.create({
      style: { position: 'absolute', top: 0, bottom: 0, width: '38%' },
    }).style,
  }
}
