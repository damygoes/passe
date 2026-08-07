import { LinearGradient } from '@/components/ui/linear-gradient'
import { useTheme } from '@/hooks/useTheme'
import { createBadgeRecipe } from '@/recipes/badge'
import { StyleSheet, Text, View } from 'react-native'
import type { BadgeProps } from './Badge.types'

export function Badge({
  variant = 'default',
  size = 'sm',
  children,
  style,
  labelStyle,
  ...props
}: BadgeProps) {
  const theme = useTheme()
  const recipe = createBadgeRecipe(theme)
  const variantRecipe = recipe.variants[variant]
  const sizeRecipe = recipe.sizes[size]

  return (
    <View
      style={[recipe.base.container, sizeRecipe.container, variantRecipe.container, style]}
      {...props}
    >
      {variantRecipe.gradient && (
        <LinearGradient
          colors={variantRecipe.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      <Text style={[recipe.base.label, sizeRecipe.label, variantRecipe.label, labelStyle]}>
        {children}
      </Text>
    </View>
  )
}
