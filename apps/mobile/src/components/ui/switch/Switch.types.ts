import type { StyleProp, ViewStyle } from 'react-native'

export interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  style?: StyleProp<ViewStyle>
  accessibilityLabel?: string
}
