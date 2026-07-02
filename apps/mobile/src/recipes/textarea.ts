import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native'

import type { AppTheme } from '@/hooks/useTheme'

interface TextareaRecipe {
  base: {
    input: TextStyle & ViewStyle
  }
  states: {
    focused: { borderColor: string }
    disabled: { opacity: number }
  }
}

export function createTextareaRecipe(theme: AppTheme): TextareaRecipe {
  const { colors, spacing, fontSizes, fontWeights, borderRadius } = theme

  return {
    base: {
      input: StyleSheet.create({
        style: {
          minHeight: 112,
          borderRadius: borderRadius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.input,
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[3],
          fontSize: fontSizes.base,
          fontWeight: fontWeights.regular,
          color: colors.foreground,
          textAlignVertical: 'top',
        },
      }).style,
    },
    states: {
      focused: { borderColor: colors.ring },
      disabled: { opacity: 0.5 },
    },
  }
}
