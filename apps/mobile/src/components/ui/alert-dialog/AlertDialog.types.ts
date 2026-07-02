import type { ReactNode } from 'react'
import type { TextProps, ViewProps } from 'react-native'
import type { ButtonProps } from '@/components/ui/button'

export interface AlertDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

export interface AlertDialogTriggerProps {
  children: ReactNode
}

export interface AlertDialogContentProps extends ViewProps {
  children: ReactNode
}

export interface AlertDialogHeaderProps extends ViewProps {
  children?: ReactNode
}

export interface AlertDialogFooterProps extends ViewProps {
  children?: ReactNode
}

export interface AlertDialogActionProps extends Omit<ButtonProps, 'children'> {
  children: ReactNode
}

export interface AlertDialogCancelProps extends Omit<ButtonProps, 'children'> {
  children: ReactNode
}

export interface AlertDialogViewSubProps extends ViewProps {
  children?: ReactNode
}

export interface AlertDialogTextSubProps extends TextProps {
  children?: ReactNode
}
