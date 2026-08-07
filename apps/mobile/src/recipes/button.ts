import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native'

import type { ButtonSize, ButtonVariant } from '@/components/ui/button'
import type { AppTheme } from '@/hooks/useTheme'

interface ButtonRecipe {
  base: {
    container: ViewStyle
    label: TextStyle
  }

  variants: Record<
    ButtonVariant,
    {
      container: ViewStyle
      label: TextStyle
      spinnerColor: string
    }
  >

  sizes: Record<
    ButtonSize,
    {
      container: ViewStyle
      label: TextStyle
    }
  >

  states: {
    disabled: {
      container: ViewStyle
    }

    fullWidth: {
      container: ViewStyle
    }
  }
}

export function createButtonRecipe(theme: AppTheme): ButtonRecipe {
  const { colors, spacing, borderRadius, fontSizes, fontWeights } = theme

  return {
    base: {
      container: StyleSheet.create({
        style: {
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          borderRadius: borderRadius.full,
        },
      }).style,

      label: StyleSheet.create({
        style: {
          fontWeight: fontWeights.medium,
        },
      }).style,
    },

    variants: {
      primary: {
        container: {
          backgroundColor: colors.primary,
        },

        label: {
          color: colors.primaryForeground,
        },

        spinnerColor: colors.primaryForeground,
      },

      secondary: {
        container: {
          backgroundColor: colors.secondary,
        },

        label: {
          color: colors.secondaryForeground,
        },

        spinnerColor: colors.secondaryForeground,
      },

      ghost: {
        container: {
          backgroundColor: 'transparent',
          overflow: 'hidden',
        },

        label: {
          color: colors.mutedForeground,
        },

        spinnerColor: colors.mutedForeground,
      },

      danger: {
        container: {
          backgroundColor: colors.destructive,
        },

        label: {
          color: colors.foreground,
        },

        spinnerColor: colors.foreground,
      },
    },

    sizes: {
      sm: {
        container: {
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[2],
        },

        label: {
          fontSize: fontSizes.lg,
        },
      },

      md: {
        container: {
          paddingHorizontal: spacing[8],
          paddingVertical: spacing[4],
        },

        label: {
          fontSize: fontSizes.xl,
        },
      },

      lg: {
        container: {
          paddingHorizontal: spacing[12],
          paddingVertical: spacing[6],
          minHeight: spacing[20],
        },

        label: {
          fontSize: fontSizes['2xl'],
        },
      },
    },

    states: {
      disabled: {
        container: {
          opacity: 0.5,
        },
      },

      fullWidth: {
        container: {
          width: '100%',
        },
      },
    },
  }
}
