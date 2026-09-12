import type { StyleProp, ViewStyle } from 'react-native'

export type StatTileTone = 'plain' | 'surface' | 'sand'
export type StatTileSize = 'sm' | 'md' | 'lg' | 'xl'

export interface StatTileProps {
  value: number
  label: string
  /** Right-aligned note next to the label — matches the Stats screen's per-row copy. */
  note?: string
  tone?: StatTileTone
  size?: StatTileSize
  delayMs?: number
  style?: StyleProp<ViewStyle>
}
