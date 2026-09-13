import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native'

import type { AvatarSize } from '@/components/ui/avatar/Avatar.types'
import type { AppTheme } from '@/hooks/useTheme'

interface AvatarRecipe {
  sizes: Record<AvatarSize, { container: ViewStyle; fallbackText: TextStyle }>
}

export function createAvatarRecipe(theme: AppTheme): AvatarRecipe {
  const { colors, fontSizes, fontWeights } = theme

  const makeSize = (px: number, fontSize: number) => ({
    container: StyleSheet.create({
      style: {
        width: px,
        height: px,
        borderRadius: px / 2,
        backgroundColor: colors.muted,
        overflow: 'hidden' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
      },
    }).style,
    fallbackText: StyleSheet.create({
      style: {
        fontSize,
        fontWeight: fontWeights.semibold,
        color: colors.mutedForeground,
        textTransform: 'uppercase' as const,
      },
    }).style,
  })

  return {
    sizes: {
      sm: makeSize(24, fontSizes.xs),
      default: makeSize(32, fontSizes.sm),
      lg: makeSize(40, fontSizes.base),
      xl: makeSize(88, fontSizes['4xl']),
    },
  }
}
