import { StyleSheet, type ViewStyle } from 'react-native'

import type { CardSize } from '@/components/ui/card/Card.types'
import type { AppTheme } from '@/hooks/useTheme'

interface CardRecipe {
  sizes: Record<CardSize, { padding: number }>
  base: {
    container: ViewStyle
    header: ViewStyle
    footer: ViewStyle
  }
}

export function createCardRecipe(theme: AppTheme): CardRecipe {
  const { colors, spacing, borderRadius } = theme

  return {
    sizes: {
      default: { padding: spacing[4] },
      sm: { padding: spacing[3] },
    },

    base: {
      container: StyleSheet.create({
        style: {
          backgroundColor: colors.background,
          borderRadius: borderRadius.xl,
          borderWidth: 0.5,
          borderColor: colors.border,
          shadowColor: colors.border,
          overflow: 'hidden',
        },
      }).style,

      header: StyleSheet.create({
        style: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: spacing[2],
        },
      }).style,

      footer: StyleSheet.create({
        style: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.muted,
          flexDirection: 'row',
          alignItems: 'center',
        },
      }).style,
    },
  }
}
