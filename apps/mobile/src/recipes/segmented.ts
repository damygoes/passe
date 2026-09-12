import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native'

import type { AppTheme } from '@/hooks/useTheme'

interface SegmentedRecipe {
  group: ViewStyle
  item: {
    base: ViewStyle
    checked: ViewStyle
    unchecked: ViewStyle
  }
  label: {
    base: TextStyle
    checked: TextStyle
    unchecked: TextStyle
  }
}

export function createSegmentedRecipe(theme: AppTheme): SegmentedRecipe {
  const { colors, spacing, fontSizes, fontWeights, borderRadius } = theme

  return {
    group: StyleSheet.create({
      style: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.background,
        padding: 4,
      },
    }).style,

    item: {
      base: StyleSheet.create({
        style: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: spacing[2] - 2,
          paddingHorizontal: spacing[3],
          borderRadius: borderRadius.full,
        },
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
