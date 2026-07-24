import type { ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export interface ScrapbookPhotoFrameProps {
  id: string
  /** 'lg' for full-width hero photos (smaller tilt); 'md' for image-text/carousel photos */
  size: 'lg' | 'md'
  style?: StyleProp<ViewStyle>
  children: ReactNode
}
