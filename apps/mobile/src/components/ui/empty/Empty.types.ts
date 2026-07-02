import type { ReactNode } from 'react'
import type { TextProps, ViewProps } from 'react-native'

export interface EmptyProps extends ViewProps {
  children: ReactNode
}

export interface EmptyMediaProps extends ViewProps {
  variant?: 'default' | 'icon'
  children?: ReactNode
}

export interface EmptyViewSubProps extends ViewProps {
  children?: ReactNode
}

export interface EmptyTextSubProps extends TextProps {
  children?: ReactNode
}
