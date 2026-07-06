import type { ReactNode } from 'react'
import type { StyleProp, TextStyle, ViewProps } from 'react-native'

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'stamp'

export interface BadgeProps extends ViewProps {
  variant?: BadgeVariant
  /** Overrides for the label text (e.g. light text when shown over a photo scrim) */
  labelStyle?: StyleProp<TextStyle>
  children: ReactNode
}
