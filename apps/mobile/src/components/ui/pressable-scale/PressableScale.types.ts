import type { PressableProps, StyleProp, ViewStyle } from 'react-native'

export interface PressableScaleProps extends PressableProps {
  /** Scale applied while pressed */
  pressedScale?: number
  /** Rotation (degrees) at rest — springs to 0 while pressed (scrapbook tilt) */
  restRotation?: number
  /** Style for the animated wrapper (shadows, margins) — not the Pressable itself */
  containerStyle?: StyleProp<ViewStyle>
}
