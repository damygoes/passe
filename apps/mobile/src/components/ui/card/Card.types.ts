import type { ReactNode } from 'react'
import type { TextProps, ViewProps } from 'react-native'

export type CardSize = 'default' | 'sm'

export interface CardProps extends ViewProps {
  size?: CardSize
  children: ReactNode
}

export interface CardViewSubProps extends ViewProps {
  children?: ReactNode
}

export interface CardTextSubProps extends TextProps {
  children?: ReactNode
}
