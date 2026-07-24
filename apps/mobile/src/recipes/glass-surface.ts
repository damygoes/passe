import { StyleSheet, type ViewStyle } from 'react-native'

import type { GlassSurfaceShape } from '@/components/ui/glass-surface/GlassSurface.types'
import type { AppTheme } from '@/hooks/useTheme'

interface GlassSurfaceRecipe {
  shapes: Record<GlassSurfaceShape, ViewStyle>
  fallback: ViewStyle
}

export function createGlassSurfaceRecipe(theme: AppTheme): GlassSurfaceRecipe {
  const { colors, borderRadius } = theme

  return {
    shapes: {
      rounded: StyleSheet.create({
        style: { borderRadius: borderRadius.xl, overflow: 'hidden' },
      }).style,

      capsule: StyleSheet.create({
        style: { borderRadius: borderRadius.full, overflow: 'hidden' },
      }).style,

      circle: StyleSheet.create({
        style: { borderRadius: borderRadius.full, overflow: 'hidden', aspectRatio: 1 },
      }).style,

      none: StyleSheet.create({ style: {} }).style,
    },

    // expo-glass-effect renders a fully transparent view wherever Liquid Glass isn't
    // available (iOS <26, Android, web) — this approximates the glass look with a flat
    // translucent theme surface instead of leaving content floating with no backing.
    fallback: StyleSheet.create({
      style: { backgroundColor: `${colors.background}D9` },
    }).style,
  }
}
