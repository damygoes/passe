import { useId } from 'react'
import Svg, { Defs, LinearGradient as SvgLinearGradient, Rect, Stop } from 'react-native-svg'

import type { LinearGradientProps } from './LinearGradient.types'

// Stop takes color and opacity separately, so #RRGGBBAA must be split
function parseStopColor(color: string): { color: string; opacity: number } {
  if (color.startsWith('#') && color.length === 9) {
    return { color: color.slice(0, 7), opacity: parseInt(color.slice(7), 16) / 255 }
  }
  return { color, opacity: 1 }
}

/**
 * Drop-in replacement for expo-linear-gradient's LinearGradient, drawn with
 * react-native-svg — no extra native module required beyond react-native-svg,
 * which the app already ships for icons and map pins.
 */
export function LinearGradient({
  colors,
  locations,
  start = { x: 0.5, y: 0 },
  end = { x: 0.5, y: 1 },
  style,
}: LinearGradientProps) {
  // useId's ":" delimiters are stripped — they break url(#id) references in SVG
  const gradientId = `gradient-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`

  return (
    <Svg style={style} pointerEvents="none">
      <Defs>
        <SvgLinearGradient id={gradientId} x1={start.x} y1={start.y} x2={end.x} y2={end.y}>
          {colors.map((color, index) => {
            const stop = parseStopColor(color)
            const offset =
              locations?.[index] ?? (colors.length > 1 ? index / (colors.length - 1) : 0)
            return (
              <Stop key={index} offset={offset} stopColor={stop.color} stopOpacity={stop.opacity} />
            )
          })}
        </SvgLinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${gradientId})`} />
    </Svg>
  )
}
