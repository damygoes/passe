import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native'

import type { AppTheme } from '@/hooks/useTheme'

interface InputRecipe {
  base: {
    wrapper: ViewStyle
    input: TextStyle
  }
  states: {
    focused: { wrapper: ViewStyle }
    disabled: { wrapper: ViewStyle; input: TextStyle }
  }
  iconWrapper: {
    start: ViewStyle
    end: ViewStyle
  }
}

export function createInputRecipe(theme: AppTheme): InputRecipe {
  const { colors, spacing, fontSizes, fontWeights, borderRadius } = theme

  return {
    base: {
      wrapper: StyleSheet.create({
        style: {
          flexDirection: 'row',
          alignItems: 'center',
          height: 48,
          borderRadius: borderRadius.xl,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.background,
          paddingHorizontal: spacing[3],
          gap: spacing[2],
        },
      }).style,

      input: StyleSheet.create({
        style: {
          flex: 1,
          fontSize: fontSizes.base,
          fontWeight: fontWeights.regular,
          color: colors.foreground,
          padding: 0,
        },
      }).style,
    },

    states: {
      focused: {
        wrapper: { borderColor: colors.ring },
      },
      disabled: {
        wrapper: { opacity: 0.5 },
        input: { color: colors.mutedForeground },
      },
    },

    iconWrapper: {
      start: StyleSheet.create({
        style: { alignItems: 'center', justifyContent: 'center' },
      }).style,
      end: StyleSheet.create({
        style: { alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' },
      }).style,
    },
  }
}
