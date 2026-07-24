import { ActivityIndicator } from 'react-native'

import { useTheme } from '@/hooks/useTheme'
import { createSpinnerRecipe } from '@/recipes/spinner'
import type { SpinnerProps } from './Spinner.types'

/**
 * Themed indeterminate spinner — the one sanctioned wrapper around
 * ActivityIndicator. Use Skeleton for content placeholders; use Spinner only
 * for in-control busy states (button loading, input lookups).
 */
export function Spinner({ size = 'sm', color, style }: SpinnerProps) {
  const recipe = createSpinnerRecipe(useTheme())

  return (
    <ActivityIndicator
      size={recipe.sizes[size]}
      color={color ?? recipe.defaultColor}
      style={style}
    />
  )
}
