import type { StyleProp, TextInputProps, ViewStyle } from 'react-native'
import type { IconName, IconSize } from '@/components/ui/icon'

export interface InputProps extends Omit<TextInputProps, 'style'> {
  style?: StyleProp<ViewStyle>
  icon?: IconName
  iconPosition?: 'start' | 'end'
  iconSize?: IconSize
  isLoading?: boolean
  onIconPress?: () => void
}
