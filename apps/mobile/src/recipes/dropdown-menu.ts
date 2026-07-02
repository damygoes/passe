import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native'

import type { DropdownMenuItemVariant } from '@/components/ui/dropdown-menu/DropdownMenu.types'
import type { AppTheme } from '@/hooks/useTheme'

interface DropdownMenuRecipe {
  base: {
    content: ViewStyle
    item: ViewStyle
    label: TextStyle
    separator: ViewStyle
  }
  variants: Record<DropdownMenuItemVariant, { label: TextStyle }>
}

export function createDropdownMenuRecipe(theme: AppTheme): DropdownMenuRecipe {
  const { colors, spacing, fontSizes, fontWeights, borderRadius } = theme

  return {
    base: {
      content: StyleSheet.create({
        style: {
          backgroundColor: colors.popover,
          borderRadius: borderRadius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          minWidth: 180,
          paddingVertical: spacing[1],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 8,
          elevation: 6,
        },
      }).style,

      item: StyleSheet.create({
        style: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[2],
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[2],
        },
      }).style,

      label: StyleSheet.create({
        style: {
          flex: 1,
          fontSize: fontSizes.sm,
          fontWeight: fontWeights.regular,
          color: colors.popoverForeground,
        },
      }).style,

      separator: StyleSheet.create({
        style: {
          height: 1,
          backgroundColor: colors.border,
          marginVertical: spacing[1],
        },
      }).style,
    },

    variants: {
      default: {
        label: { color: colors.popoverForeground },
      },
      destructive: {
        label: { color: colors.destructive },
      },
    },
  }
}
