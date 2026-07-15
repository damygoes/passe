import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native'

import type { AppTheme } from '@/hooks/useTheme'

interface MemoryLayoutMenuRecipe {
  base: {
    container: ViewStyle
    row: ViewStyle
    trigger: ViewStyle
    triggerLabel: TextStyle
    iconButton: ViewStyle
  }
  states: {
    disabled: { trigger: ViewStyle; iconButton: ViewStyle }
  }
}

export function createMemoryLayoutMenuRecipe(theme: AppTheme): MemoryLayoutMenuRecipe {
  const { colors, spacing, fontSizes, borderRadius } = theme

  return {
    base: {
      container: StyleSheet.create({
        style: { gap: spacing[2], marginTop: spacing[1] },
      }).style,

      row: StyleSheet.create({
        style: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          rowGap: spacing[2],
          columnGap: spacing[2],
        },
      }).style,

      trigger: StyleSheet.create({
        style: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[1],
          paddingHorizontal: spacing[2],
          paddingVertical: spacing[1],
          borderRadius: borderRadius.md,
          backgroundColor: colors.muted,
        },
      }).style,

      triggerLabel: StyleSheet.create({
        style: { fontSize: fontSizes.xs, color: colors.mutedForeground },
      }).style,

      // Shared single-icon button — flip, move up/down, public toggle, delete trigger.
      iconButton: StyleSheet.create({
        style: {
          paddingHorizontal: spacing[2],
          paddingVertical: spacing[1],
          borderRadius: borderRadius.md,
          backgroundColor: colors.muted,
        },
      }).style,
    },

    states: {
      disabled: {
        trigger: StyleSheet.create({ style: { opacity: 0.5 } }).style,
        iconButton: StyleSheet.create({ style: { opacity: 0.5 } }).style,
      },
    },
  }
}
