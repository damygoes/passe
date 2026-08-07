import type { ReactNode } from 'react'
import type { StyleProp, TextStyle, ViewProps } from 'react-native'

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'ghost'
  | 'stamp'
  | 'plan-explorer'
  | 'plan-collector'

export type BadgeSize = 'sm' | 'md' | 'lg' | 'xl'

export interface BadgeProps extends ViewProps {
  variant?: BadgeVariant
  size?: BadgeSize
  /** Overrides for the label text (e.g. light text when shown over a photo scrim) */
  labelStyle?: StyleProp<TextStyle>
  children: ReactNode
}
