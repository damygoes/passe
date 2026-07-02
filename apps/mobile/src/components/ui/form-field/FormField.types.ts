import type { ReactNode } from 'react'
import type { InputProps } from '@/components/ui/input'

export interface FormFieldProps extends InputProps {
  label: string
  labelRight?: ReactNode
  error?: string
}
