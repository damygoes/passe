import { useTheme } from '@/hooks/useTheme'
import { createAvatarRecipe } from '@/recipes/avatar'
import { Image } from 'expo-image'
import { createContext, useContext } from 'react'
import { Text, View } from 'react-native'
import type { AvatarFallbackProps, AvatarImageProps, AvatarProps, AvatarSize } from './Avatar.types'

const AvatarContext = createContext<{ size: AvatarSize }>({ size: 'default' })

export function Avatar({ size = 'default', style, children, ...props }: AvatarProps) {
  const theme = useTheme()
  const recipe = createAvatarRecipe(theme)

  return (
    <AvatarContext.Provider value={{ size }}>
      <View style={[recipe.sizes[size].container, style]} {...props}>
        {children}
      </View>
    </AvatarContext.Provider>
  )
}

export function AvatarImage({ ...props }: AvatarImageProps) {
  const { size } = useContext(AvatarContext)
  const theme = useTheme()
  const recipe = createAvatarRecipe(theme)
  const { width, height } = recipe.sizes[size].container as { width: number; height: number }

  return (
    <Image
      style={{ width, height, borderRadius: width / 2 }}
      contentFit="cover"
      {...props}
    />
  )
}

export function AvatarFallback({ style, children, ...props }: AvatarFallbackProps) {
  const { size } = useContext(AvatarContext)
  const theme = useTheme()
  const recipe = createAvatarRecipe(theme)

  return (
    <View
      style={[
        { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
        style,
      ]}
      {...props}
    >
      <Text style={recipe.sizes[size].fallbackText}>{children}</Text>
    </View>
  )
}
