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
  /** Non-interactive; pairs with `trailing` for plan-gated items */
  disabled?: boolean
  /** Right-aligned annotation (e.g. plan badge) — mirrors web's DropdownMenuShortcut */
  trailing?: ReactNode
}

export type DropdownMenuSeparatorProps = ViewProps
