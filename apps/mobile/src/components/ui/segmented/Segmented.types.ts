import type { StyleProp, ViewStyle } from 'react-native'

export interface SegmentedOption {
  value: string
  label: string
}

export interface SegmentedProps {
  options: SegmentedOption[]
  value: string
  onValueChange: (value: string) => void
  style?: StyleProp<ViewStyle>
}
