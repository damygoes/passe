import { useTheme } from '@/hooks/useTheme'
import { createBadgeRecipe } from '@/recipes/badge'
import { Text, View } from 'react-native'
import type { BadgeProps } from './Badge.types'

export function Badge({ variant = 'default', children, style, ...props }: BadgeProps) {
  const theme = useTheme()
  const recipe = createBadgeRecipe(theme)
  const variantRecipe = recipe.variants[variant]

  return (
    <View style={[recipe.base.container, variantRecipe.container, style]} {...props}>
      <Text style={[recipe.base.label, variantRecipe.label]}>{children}</Text>
    </View>
  )
}
