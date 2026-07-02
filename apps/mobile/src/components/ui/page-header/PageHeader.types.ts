import type { ReactNode } from 'react'
import type { TextProps, ViewProps } from 'react-native'

export interface PageHeaderProps extends ViewProps {
  children: ReactNode
}

export interface PageHeaderViewSubProps extends ViewProps {
  children?: ReactNode
}

export interface PageHeaderTextSubProps extends TextProps {
  children?: ReactNode
}
