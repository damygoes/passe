import type { ReactNode } from 'react'
import type { ViewProps } from 'react-native'

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost'

export interface BadgeProps extends ViewProps {
  variant?: BadgeVariant
  children: ReactNode
}
