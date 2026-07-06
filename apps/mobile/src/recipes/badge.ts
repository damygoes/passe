import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native'

import type { BadgeVariant } from '@/components/ui/badge/Badge.types'
import type { AppTheme } from '@/hooks/useTheme'

interface BadgeRecipe {
  base: {
    container: ViewStyle
    label: TextStyle
  }
  variants: Record<BadgeVariant, { container: ViewStyle; label: TextStyle }>
}

export function createBadgeRecipe(theme: AppTheme): BadgeRecipe {
  const { colors, spacing, fontSizes, fontWeights, borderRadius } = theme

  return {
    base: {
      container: StyleSheet.create({
        style: {
          alignSelf: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing[2],
          paddingVertical: 2,
          borderRadius: borderRadius.full,
          borderWidth: 1,
          borderColor: 'transparent',
        },
      }).style,

      label: StyleSheet.create({
        style: {
          fontSize: fontSizes.xs,
          fontWeight: fontWeights.medium,
        },
      }).style,
    },

    variants: {
      default: {
        container: { backgroundColor: colors.primary, borderColor: 'transparent' },
        label: { color: colors.primaryForeground },
      },

      secondary: {
        container: { backgroundColor: colors.secondary, borderColor: 'transparent' },
        label: { color: colors.secondaryForeground },
      },

      destructive: {
        container: { backgroundColor: colors.destructive, borderColor: 'transparent' },
        label: { color: colors.foreground },
      },

      outline: {
        container: { backgroundColor: 'transparent', borderColor: colors.border },
        label: { color: colors.foreground },
      },

      ghost: {
        container: { backgroundColor: colors.muted, borderColor: 'transparent' },
        label: { color: colors.mutedForeground },
      },

      // Passport-stamp look: dashed ink border, uppercase label, slight tilt
      stamp: {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderStyle: 'dashed',
          borderColor: colors.primary,
          borderRadius: borderRadius.sm,
          paddingHorizontal: spacing[2] - 2,
          transform: [{ rotate: '-1deg' }],
        },
        label: {
          color: colors.primary,
          fontSize: 10,
          fontWeight: fontWeights.semibold,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
        },
      },
    },
  }
}
