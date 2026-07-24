import { useId } from 'react'
import { StyleSheet, View } from 'react-native'
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Polygon,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg'

import type { ScrapbookTextureProps } from './ScrapbookTexture.types'

// Deterministic pseudo-random grain specks — computed once at module load
// (not per-render/per-mount) so every scrapbook screen shows the same paper
// texture and re-renders never regenerate it. Mirrors the intent of web's
// seeded SVG feTurbulence noise, without relying on filter primitives that
// react-native-svg (RNSVG) doesn't implement.
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const GRAIN_SPECKS = (() => {
  const random = mulberry32(7)
  return Array.from({ length: 180 }, () => ({
    x: random() * 100,
    y: random() * 100,
    r: 0.4 + random() * 0.5,
    opacity: 0.05 + random() * 0.1,
  }))
})()

const CORNER_SIZE = 56

// Warm-paper texture for the scrapbook theme — a soft edge vignette + faint
// grain speckling + a folded page-corner, all drawn with react-native-svg
// (already a dependency for icons/map pins) rather than a baked bitmap asset.
// Render as an absolute-fill decorative layer behind real content, with
// pointerEvents="none" throughout so it never intercepts touches.
export function ScrapbookTexture({ style }: ScrapbookTextureProps) {
  const vignetteId = `scrapbook-vignette-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`
  const cornerId = `scrapbook-corner-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`

  return (
    <View style={[StyleSheet.absoluteFill, style]} pointerEvents="none">
      <Svg width="100%" height="100%" pointerEvents="none">
        <Defs>
          <RadialGradient id={vignetteId} cx={0.5} cy={0.42} r={0.75}>
            <Stop offset={0.65} stopColor="#2c1a0e" stopOpacity={0} />
            <Stop offset={1} stopColor="#2c1a0e" stopOpacity={0.14} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${vignetteId})`} />
        {GRAIN_SPECKS.map((speck, index) => (
          <Circle
            key={index}
            cx={`${speck.x}%`}
            cy={`${speck.y}%`}
            r={speck.r}
            fill="#2c1a0e"
            fillOpacity={speck.opacity}
          />
        ))}
      </Svg>

      <Svg
        width={CORNER_SIZE}
        height={CORNER_SIZE}
        style={{ position: 'absolute', right: 0, bottom: 0 }}
        pointerEvents="none"
      >
        <Defs>
          <LinearGradient id={cornerId} x1="0" y1="0" x2="1" y2="1">
            <Stop offset={0.5} stopColor="#2c1a0e" stopOpacity={0} />
            <Stop offset={0.5} stopColor="#2c1a0e" stopOpacity={0.06} />
            <Stop offset={1} stopColor="#2c1a0e" stopOpacity={0.16} />
          </LinearGradient>
        </Defs>
        <Polygon
          points={`${CORNER_SIZE},0 ${CORNER_SIZE},${CORNER_SIZE} 0,${CORNER_SIZE}`}
          fill={`url(#${cornerId})`}
        />
      </Svg>
    </View>
  )
}
