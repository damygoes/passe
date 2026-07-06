import { iconMap } from '@passe/ui/icon-map'
import { Image, type ImageRef } from 'expo-image'
import { useCallback, useMemo, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Circle, G, Path, Svg, Text as SvgText } from 'react-native-svg'

import { useTheme } from '@/hooks/useTheme'

export const SINGLE_PIN_BUCKET = 'single'

const LOCATION_ICON_PATHS = iconMap.location.map((element) => String(element[1].d))

// Rasterized once per bucket key at 4x the SVG viewBox for a crisp result on
// retina screens, then cached for the lifetime of the map screen.
const PIN_VIEWBOX_SIZE = 24
const PIN_RENDER_SIZE = PIN_VIEWBOX_SIZE * 4

export function bucketKeyForCount(count: number): string {
  return count <= 1 ? SINGLE_PIN_BUCKET : String(count)
}

// Mirrors web's cluster bubble sizing thresholds (apps/web WorldMap.tsx).
export function clusterIconSize(count: number): number {
  if (count <= 9) return 36
  if (count <= 49) return 44
  return 52
}

interface PinBucket {
  key: string
  count: number
}

interface PinIconSvgProps {
  bucket: PinBucket
  primaryColor: string
  onCaptured: (bucketKey: string, image: ImageRef) => void
}

function PinIconSvg({ bucket, primaryColor, onCaptured }: PinIconSvgProps) {
  const svgRef = useRef<InstanceType<typeof Svg>>(null)

  const handleLayout = useCallback(() => {
    svgRef.current?.toDataURL((base64) => {
      Image.loadAsync({ uri: `data:image/png;base64,${base64}` }).then((image) => {
        onCaptured(bucket.key, image)
      })
    })
  }, [bucket.key, onCaptured])

  if (bucket.key === SINGLE_PIN_BUCKET) {
    return (
      <View onLayout={handleLayout}>
        <Svg
          ref={svgRef}
          width={PIN_RENDER_SIZE}
          height={PIN_RENDER_SIZE}
          viewBox={`0 0 ${PIN_VIEWBOX_SIZE} ${PIN_VIEWBOX_SIZE}`}
        >
          <Path d="M6 14 L18 14 L12 23 Z" fill={primaryColor} />
          <Circle cx={12} cy={10} r={9} fill={primaryColor} stroke="#fff" strokeWidth={1} />
          <G transform="translate(5.52, 3.52) scale(0.54)">
            {LOCATION_ICON_PATHS.map((d) => (
              <Path key={d} d={d} stroke="#fff" strokeWidth={1.5} fill="none" />
            ))}
          </G>
        </Svg>
      </View>
    )
  }

  const size = clusterIconSize(bucket.count)
  const renderSize = size * 2

  return (
    <View onLayout={handleLayout}>
      <Svg ref={svgRef} width={renderSize} height={renderSize} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 2}
          fill={primaryColor}
          stroke="#fff"
          strokeWidth={3}
        />
        <SvgText
          x={size / 2}
          y={size / 2}
          fill="#fff"
          fontSize={14}
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="central"
        >
          {bucket.count}
        </SvgText>
      </Svg>
    </View>
  )
}

interface MapPinIconGeneratorProps {
  buckets: PinBucket[]
  primaryColor: string
  onCaptured: (bucketKey: string, image: ImageRef) => void
}

function MapPinIconGenerator({ buckets, primaryColor, onCaptured }: MapPinIconGeneratorProps) {
  return (
    <View style={styles.hidden} pointerEvents="none">
      {buckets.map((bucket) => (
        <PinIconSvg key={bucket.key} bucket={bucket} primaryColor={primaryColor} onCaptured={onCaptured} />
      ))}
    </View>
  )
}

export function useMapPinIcons(counts: number[]) {
  const { colors } = useTheme()
  const [icons, setIcons] = useState<Record<string, ImageRef | undefined>>({})

  const buckets = useMemo(() => {
    const unique = new Map<string, PinBucket>()
    for (const count of counts) {
      const key = bucketKeyForCount(count)
      if (!unique.has(key)) unique.set(key, { key, count })
    }
    return Array.from(unique.values())
  }, [counts])

  // Buckets not yet cached still need their hidden `<Svg>` mounted so it can
  // be rasterized; stable `key`s below keep React from remounting (and
  // re-firing onLayout for) buckets already captured but pending state update.
  const pendingBuckets = useMemo(() => buckets.filter((bucket) => !(bucket.key in icons)), [buckets, icons])

  const handleCaptured = useCallback((bucketKey: string, image: ImageRef) => {
    setIcons((prev) => (bucketKey in prev ? prev : { ...prev, [bucketKey]: image }))
  }, [])

  const pending =
    pendingBuckets.length === 0 ? null : (
      <MapPinIconGenerator
        buckets={pendingBuckets}
        primaryColor={colors.primary}
        onCaptured={handleCaptured}
      />
    )

  return { icons, pending }
}

const styles = StyleSheet.create({
  hidden: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    opacity: 0,
  },
})
