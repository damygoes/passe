import type { ReactNode } from 'react'
import type { ViewProps } from 'react-native'

export interface DropdownMenuProps {
  children: ReactNode
}

export interface DropdownMenuTriggerProps {
  children: ReactNode
}

export interface DropdownMenuContentProps extends ViewProps {
  children: ReactNode
}

export interface DropdownMenuGroupProps extends ViewProps {
  children?: ReactNode
}

export interface DropdownMenuLabelProps extends ViewProps {
  children: ReactNode
}

export type DropdownMenuItemVariant = 'default' | 'destructive'

export interface DropdownMenuItemProps extends ViewProps {
  variant?: DropdownMenuItemVariant
  onPress?: () => void
  children: ReactNode
  icon?: ReactNode
}

export type DropdownMenuSeparatorProps = ViewProps
