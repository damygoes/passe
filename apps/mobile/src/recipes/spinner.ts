import type { SpinnerSize } from '@/components/ui/spinner/Spinner.types'
import type { AppTheme } from '@/hooks/useTheme'

interface SpinnerRecipe {
  defaultColor: string
  // RN's ActivityIndicator sizes via its own prop, not a style — map ours to its values
  sizes: Record<SpinnerSize, 'small' | 'large'>
}

export function createSpinnerRecipe(theme: AppTheme): SpinnerRecipe {
  return {
    defaultColor: theme.colors.mutedForeground,
    sizes: {
      sm: 'small',
      md: 'large',
    },
  }
}
