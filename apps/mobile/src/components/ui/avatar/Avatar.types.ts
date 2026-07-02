import type { ReactNode } from 'react'
import type { ImageProps } from 'expo-image'
import type { ViewProps } from 'react-native'

export type AvatarSize = 'sm' | 'default' | 'lg'

export interface AvatarProps extends ViewProps {
  size?: AvatarSize
  children: ReactNode
}

export type AvatarImageProps = Omit<ImageProps, 'style'>

export interface AvatarFallbackProps extends ViewProps {
  children: ReactNode
}
