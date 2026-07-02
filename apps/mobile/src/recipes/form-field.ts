import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native'

import type { AppTheme } from '@/hooks/useTheme'

interface FormFieldRecipe {
  base: {
    wrapper: ViewStyle
    labelRow: ViewStyle
    label: TextStyle
    errorText: TextStyle
  }
}

export function createFormFieldRecipe(theme: AppTheme): FormFieldRecipe {
  const { colors, spacing, fontSizes, fontWeights } = theme

  return {
    base: {
      wrapper: StyleSheet.create({
        style: {
          gap: spacing[2],
        },
      }).style,

      labelRow: StyleSheet.create({
        style: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
      }).style,

      label: StyleSheet.create({
        style: {
          fontSize: fontSizes.sm,
          fontWeight: fontWeights.medium,
          color: colors.foreground,
        },
      }).style,

      errorText: StyleSheet.create({
        style: {
          fontSize: fontSizes.xs,
          color: colors.destructive,
        },
      }).style,
    },
  }
}
