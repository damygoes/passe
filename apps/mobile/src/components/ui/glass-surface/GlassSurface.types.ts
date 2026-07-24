import type { ReactNode } from 'react'
import type { ViewProps } from 'react-native'

export type GlassSurfaceVariant = 'regular' | 'clear'
export type GlassSurfaceShape = 'rounded' | 'capsule' | 'circle' | 'none'

export interface GlassSurfaceProps extends ViewProps {
  variant?: GlassSurfaceVariant
  shape?: GlassSurfaceShape
  tint?: string
  isInteractive?: boolean
  children?: ReactNode
}
