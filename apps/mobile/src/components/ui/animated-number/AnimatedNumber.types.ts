import type { TextStyle, StyleProp } from 'react-native'

export interface AnimatedNumberProps {
  /** Final value the number ticks up to */
  value: number
  /** Delay in ms before the count starts */
  delayMs?: number
  style?: StyleProp<TextStyle>
}
