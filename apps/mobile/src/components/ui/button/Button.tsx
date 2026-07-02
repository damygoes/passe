import { useTheme } from '@/hooks/useTheme'
import { createButtonRecipe } from '@/recipes/button'

import { ActivityIndicator, Text, TouchableOpacity } from 'react-native'

import type { ButtonProps } from './Button.types'

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  ...props
}: ButtonProps) {
  const theme = useTheme()
  const recipe = createButtonRecipe(theme)

  const isDisabled = disabled || loading

  const variantRecipe = recipe.variants[variant]
  const sizeRecipe = recipe.sizes[size]

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      style={[
        recipe.base.container,
        variantRecipe.container,
        sizeRecipe.container,
        fullWidth && recipe.states.fullWidth.container,
        isDisabled && recipe.states.disabled.container,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variantRecipe.spinnerColor} />
      ) : typeof children === 'string' ? (
        <Text style={[recipe.base.label, variantRecipe.label, sizeRecipe.label]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  )
}
