import type { StyleProp, ViewStyle } from 'react-native'

export interface GradientPoint {
  x: number
  y: number
}

export interface LinearGradientProps {
  /** Gradient colors in order; supports #RRGGBB and #RRGGBBAA */
  colors: readonly string[]
  /** Per-color stop positions (0–1); defaults to evenly spaced */
  locations?: readonly number[]
  /** Gradient start point in the unit square; defaults to top center */
  start?: GradientPoint
  /** Gradient end point in the unit square; defaults to bottom center */
  end?: GradientPoint
  style?: StyleProp<ViewStyle>
}
