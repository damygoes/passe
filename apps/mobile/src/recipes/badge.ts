import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native'

import type { BadgeSize, BadgeVariant } from '@/components/ui/badge/Badge.types'
import type { AppTheme } from '@/hooks/useTheme'

interface BadgeRecipe {
  base: {
    container: ViewStyle
    label: TextStyle
  }
  variants: Record<
    BadgeVariant,
    { container: ViewStyle; label: TextStyle; gradient?: readonly string[] }
  >
  sizes: Record<BadgeSize, { container: ViewStyle; label: TextStyle }>
}

export function createBadgeRecipe(theme: AppTheme): BadgeRecipe {
  const { colors, palette, spacing, fontSizes, fontWeights, borderRadius } = theme

  return {
    base: {
      container: StyleSheet.create({
        style: {
          alignSelf: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: borderRadius.full,
          borderWidth: 1,
          borderColor: 'transparent',
          overflow: 'hidden',
        },
      }).style,

      label: StyleSheet.create({
        style: {
          fontWeight: fontWeights.medium,
        },
      }).style,
    },

    sizes: {
      sm: {
        container: { paddingHorizontal: spacing[2], paddingVertical: 2 },
        label: { fontSize: fontSizes.xs },
      },

      md: {
        container: { paddingHorizontal: spacing[3], paddingVertical: 3 },
        label: { fontSize: fontSizes.sm },
      },

      lg: {
        container: { paddingHorizontal: spacing[3], paddingVertical: spacing[1] },
        label: { fontSize: fontSizes.base },
      },

      xl: {
        container: { paddingHorizontal: spacing[4], paddingVertical: spacing[2] },
        label: { fontSize: fontSizes.lg },
      },
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
        label: { color: colors.mutedForeground, fontWeight: fontWeights.semibold },
      },

      // Tier badges: paid plans get a foil gradient (same hue, light→dark shade) so they read
      // as more premium without introducing off-brand colors. Gradient stops are fixed palette
      // values (not theme-dependent), so label color is pinned too rather than following
      // colors.secondaryForeground, which flips to a light tone in dark mode and disappears
      // against this always-light sandyBeige gradient
      'plan-explorer': {
        container: { backgroundColor: colors.secondary, borderColor: 'transparent' },
        label: { color: palette.darkEspresso.DEFAULT, fontWeight: fontWeights.semibold },
        gradient: [palette.sandyBeige.light, palette.sandyBeige.dark],
      },

      'plan-collector': {
        container: { backgroundColor: colors.primary, borderColor: 'transparent' },
        label: { color: colors.primaryForeground, fontWeight: fontWeights.semibold },
        gradient: [palette.terracotta.light, palette.terracotta.dark],
      },

      // Tag colors, matching packages/ui's Badge 1:1: PRIVATE (olive tint),
      // SHARED (terracotta tint), neutral (taupe tint) — never the paid-plan
      // foil gradients above, which are a distinct, unrelated meaning.
      private: {
        container: {
          backgroundColor: `${palette.deepOlive.DEFAULT}1F`,
          borderColor: 'transparent',
        },
        label: { color: palette.deepOlive.dark },
      },

      shared: {
        container: {
          backgroundColor: `${palette.terracotta.DEFAULT}1F`,
          borderColor: 'transparent',
        },
        label: { color: palette.terracotta.dark },
      },

      neutral: {
        container: {
          backgroundColor: `${palette.mutedTaupe.DEFAULT}1F`,
          borderColor: 'transparent',
        },
        label: { color: palette.darkEspresso.DEFAULT },
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
