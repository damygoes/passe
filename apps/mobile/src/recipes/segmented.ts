import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native'

import type { AppTheme } from '@/hooks/useTheme'

interface SegmentedRecipe {
  group: ViewStyle
  item: {
    base: ViewStyle
    divider: ViewStyle
    checked: ViewStyle
    unchecked: ViewStyle
  }
  label: {
    base: TextStyle
    checked: TextStyle
    unchecked: TextStyle
  }
}

// Matches the design system's `.seg`/`.seg-opt`: an edge-to-edge pill with no
// gaps between segments — the active segment is a solid fill, not a floating
// rounded chip, and inactive segments are separated by a thin divider rather
// than by spacing.
export function createSegmentedRecipe(theme: AppTheme): SegmentedRecipe {
  const { colors, spacing, fontSizes, fontWeights, borderRadius } = theme

  return {
    group: StyleSheet.create({
      style: {
        flexDirection: 'row',
        alignItems: 'stretch',
        overflow: 'hidden',
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.background,
      },
    }).style,

    item: {
      base: StyleSheet.create({
        style: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: spacing[2] + 1,
          paddingHorizontal: spacing[3],
        },
      }).style,
      divider: StyleSheet.create({
        style: { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: colors.border },
      }).style,
      checked: StyleSheet.create({ style: { backgroundColor: colors.primary } }).style,
      unchecked: StyleSheet.create({ style: { backgroundColor: 'transparent' } }).style,
    },

    label: {
      base: StyleSheet.create({
        style: { fontSize: fontSizes.sm, fontWeight: fontWeights.medium },
      }).style,
      checked: StyleSheet.create({ style: { color: colors.primaryForeground } }).style,
      unchecked: StyleSheet.create({ style: { color: colors.foreground } }).style,
    },
  }
}
