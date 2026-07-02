import { useTheme } from '@/hooks/useTheme'
import { createCardRecipe } from '@/recipes/card'
import { createContext, useContext } from 'react'
import { Text, View } from 'react-native'
import type { CardProps, CardSize, CardTextSubProps, CardViewSubProps } from './Card.types'

const CardContext = createContext<{ size: CardSize; padding: number }>({ size: 'default', padding: 16 })

export function Card({ size = 'default', style, children, ...props }: CardProps) {
  const theme = useTheme()
  const recipe = createCardRecipe(theme)
  const padding = recipe.sizes[size].padding

  return (
    <CardContext.Provider value={{ size, padding }}>
      <View style={[recipe.base.container, style]} {...props}>
        {children}
      </View>
    </CardContext.Provider>
  )
}

export function CardHeader({ style, children, ...props }: CardViewSubProps) {
  const theme = useTheme()
  const recipe = createCardRecipe(theme)
  const { padding } = useContext(CardContext)

  return (
    <View
      style={[recipe.base.header, { paddingHorizontal: padding, paddingTop: padding }, style]}
      {...props}
    >
      {children}
    </View>
  )
}

export function CardTitle({ style, children, ...props }: CardTextSubProps) {
  const { colors, fontSizes, fontWeights } = useTheme()

  return (
    <Text
      style={[{ fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.foreground }, style]}
      {...props}
    >
      {children}
    </Text>
  )
}

export function CardDescription({ style, children, ...props }: CardTextSubProps) {
  const { colors, fontSizes } = useTheme()

  return (
    <Text
      style={[{ fontSize: fontSizes.sm, color: colors.mutedForeground }, style]}
      {...props}
    >
      {children}
    </Text>
  )
}

export function CardContent({ style, children, ...props }: CardViewSubProps) {
  const { padding } = useContext(CardContext)

  return (
    <View style={[{ padding }, style]} {...props}>
      {children}
    </View>
  )
}

export function CardFooter({ style, children, ...props }: CardViewSubProps) {
  const theme = useTheme()
  const recipe = createCardRecipe(theme)
  const { padding } = useContext(CardContext)

  return (
    <View
      style={[recipe.base.footer, { paddingHorizontal: padding, paddingVertical: padding / 2 }, style]}
      {...props}
    >
      {children}
    </View>
  )
}
