import type { StyleProp, ViewStyle } from 'react-native'

export type SpinnerSize = 'sm' | 'md'

export interface SpinnerProps {
  size?: SpinnerSize
  /** Overrides the themed default (mutedForeground) — e.g. a button variant's spinnerColor */
  color?: string
  style?: StyleProp<ViewStyle>
}
