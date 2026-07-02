import type { iconMap } from '@passe/ui/icon-map'
import type { StyleProp, ViewStyle } from 'react-native'

export type IconName = keyof typeof iconMap

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'

export type IconPosition = 'start' | 'end'

export interface IconProps {
  name: IconName
  size?: IconSize
  color?: string
  strokeWidth?: number
  style?: StyleProp<ViewStyle>
}
