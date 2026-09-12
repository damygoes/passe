import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native'

import type { AppTheme } from '@/hooks/useTheme'
import type { StatTileSize, StatTileTone } from '@/components/ui/stat-tile/StatTile.types'

interface StatTileRecipe {
  container: {
    base: ViewStyle
    tones: Record<StatTileTone, ViewStyle>
  }
  value: {
    base: TextStyle
    sizes: Record<StatTileSize, TextStyle>
  }
  labelRow: ViewStyle
  label: TextStyle
  note: TextStyle
}

// Layout-agnostic value+label pair, matching packages/ui's StatTile — used as
// a padded card (Home), a bare row (Stats), and an inline stack (Portfolio).
export function createStatTileRecipe(theme: AppTheme): StatTileRecipe {
  const { colors, spacing, fonts, fontSizes, borderRadius } = theme

  return {
    container: {
      base: StyleSheet.create({ style: { gap: spacing[1] } }).style,
      tones: {
        plain: StyleSheet.create({ style: {} }).style,
        surface: StyleSheet.create({
          style: {
            borderRadius: borderRadius.xl + spacing[2],
            backgroundColor: colors.popover,
            padding: spacing[4],
          },
        }).style,
        sand: StyleSheet.create({
          style: {
            borderRadius: borderRadius.xl + spacing[2],
            backgroundColor: colors.secondary,
            padding: spacing[4],
          },
        }).style,
      },
    },
    value: {
      base: StyleSheet.create({
        style: { fontFamily: fonts.display },
      }).style,
      sizes: {
        sm: StyleSheet.create({ style: { fontSize: 26 } }).style,
        md: StyleSheet.create({ style: { fontSize: 34 } }).style,
        lg: StyleSheet.create({ style: { fontSize: 44 } }).style,
        xl: StyleSheet.create({ style: { fontSize: 58 } }).style,
      },
    },
    labelRow: StyleSheet.create({
      style: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
    }).style,
    label: StyleSheet.create({
      style: {
        fontFamily: fonts.mono,
        fontSize: 10,
        letterSpacing: 1.4,
        textTransform: 'uppercase',
        color: colors.mutedForeground,
        marginTop: spacing[1],
      },
    }).style,
    note: StyleSheet.create({
      style: { fontSize: fontSizes.sm, color: colors.mutedForeground },
    }).style,
  }
}
