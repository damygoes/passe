import type { MapPoint } from '@passe/types/memory'
import {
  Camera,
  Map as MapLibreMap,
  Marker,
  type CameraRef,
  type MapRef,
} from '@maplibre/maplibre-react-native'
import { useRouter } from 'expo-router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, { Easing, FadeInDown, FadeOutDown } from 'react-native-reanimated'
import Svg, { Path } from 'react-native-svg'
import Supercluster from 'supercluster'

import { useTheme } from '@/hooks/useTheme'
import { MapMemoryCard } from './MapMemoryCard'
import { groupPointsByLocation, type LocationGroup } from '../utils/groupPointsByLocation'

interface WorldMapProps {
  points: MapPoint[]
}

// Vector tiles top out well below 22 — without an explicit maxZoom, MapLibre
// has nothing to fall back to for a raster layer that isn't there. Mirrors
// apps/web WorldMap.tsx.
const MAX_ZOOM = 19
const PIN_SIZE = 26
const CLUSTER_RADIUS = 60

// Classic "map pin" glyph (same silhouette as Google Maps markers / Material's
// `place` icon) — a slim teardrop with a punched-out circle, in a 24x24
// viewBox. Mirrors apps/web WorldMap.tsx's PIN_PATH.
const PIN_PATH =
  'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'

function mapStyleUrl() {
  const key = process.env.EXPO_PUBLIC_MAPTILER_KEY ?? ''
  return `https://api.maptiler.com/maps/streets-v4/style.json?key=${key}`
}

// A single center + zoom heuristic instead of a bounds-fit — fitting bounds
// around a single point (or several at the same spot) degenerates to a
// near-zero-size box, which drives the camera to an absurd zoom level.
function computeCamera(points: MapPoint[]) {
  const avgLat = points.reduce((sum, point) => sum + point.lat, 0) / points.length
  const avgLng = points.reduce((sum, point) => sum + point.lng, 0) / points.length
  const latSpread = Math.max(...points.map((point) => point.lat)) - Math.min(...points.map((point) => point.lat))
  const lngSpread = Math.max(...points.map((point) => point.lng)) - Math.min(...points.map((point) => point.lng))
  const maxSpread = Math.max(latSpread, lngSpread)
  const zoom = maxSpread < 0.5 ? 10 : maxSpread < 5 ? 6 : maxSpread < 20 ? 4 : 2

  return { center: [avgLng, avgLat] as [number, number], zoom }
}

function clusterIconSize(count: number) {
  if (count <= 9) return 36
  if (count <= 49) return 44
  return 52
}

// GeoJSON `Position` types as `number[]`, so indexed access loses the
// fixed-length tuple guarantee under `noUncheckedIndexedAccess`. Coordinates
// always come back as [lng, lat] pairs from Supercluster's own output.
function toLngLat(coordinates: number[]): [number, number] {
  return [coordinates[0] ?? 0, coordinates[1] ?? 0]
}

interface Viewport {
  zoom: number
  bbox: [number, number, number, number]
}

export function WorldMap({ points }: WorldMapProps) {
  const router = useRouter()
  const { colors, spacing } = useTheme()
  const mapRef = useRef<MapRef>(null)
  const cameraRef = useRef<CameraRef>(null)

  const camera = useMemo(() => computeCamera(points), [points])
  // Exact-coincidence lookup (not proximity clustering, that's Supercluster
  // below) — powers the prev/next pager when several memories share a spot.
  const groups = useMemo(() => groupPointsByLocation(points), [points])
  const groupsByPointId = useMemo(() => {
    const map = new Map<string, LocationGroup>()
    for (const group of groups) {
      for (const point of group.points) map.set(point.id, group)
    }
    return map
  }, [groups])

  const [viewport, setViewport] = useState<Viewport | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<LocationGroup | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  // A tap on a Marker also reaches the underlying Map's onPress as a second,
  // separate native gesture recognizer firing in the same tick (not real DOM
  // bubbling — stopPropagation on the synthetic event doesn't prevent it).
  // This flag lets handleMapPress recognize "that press already belonged to
  // a marker" and skip clearing the selection it just set.
  const suppressMapPressRef = useRef(false)

  const index = useMemo(() => {
    const cluster = new Supercluster<MapPoint>({ radius: CLUSTER_RADIUS, maxZoom: 16 })
    cluster.load(
      points.map((point) => ({
        type: 'Feature',
        properties: point,
        geometry: { type: 'Point', coordinates: [point.lng, point.lat] },
      })),
    )
    return cluster
  }, [points])

  const handleRegionDidChange = useCallback(
    (event: { nativeEvent: { bounds: [number, number, number, number]; zoom: number } }) => {
      setViewport({ zoom: Math.round(event.nativeEvent.zoom), bbox: event.nativeEvent.bounds })
    },
    [],
  )

  const clusters = viewport ? index.getClusters(viewport.bbox, viewport.zoom) : []

  const handleClusterPress = useCallback(
    (cluster: Supercluster.ClusterFeature<MapPoint>) => {
      suppressMapPressRef.current = true
      const [lng, lat] = toLngLat(cluster.geometry.coordinates)
      const expansionZoom = Math.min(index.getClusterExpansionZoom(cluster.properties.cluster_id), MAX_ZOOM)
      cameraRef.current?.easeTo({ center: [lng, lat], zoom: expansionZoom, duration: 300 })
    },
    [index],
  )

  const handlePointPress = useCallback(
    (point: MapPoint) => {
      suppressMapPressRef.current = true
      const group = groupsByPointId.get(point.id)
      if (!group) return
      setSelectedGroup(group)
      setSelectedIndex(0)
    },
    [groupsByPointId],
  )

  const handleMapPress = useCallback(() => {
    if (suppressMapPressRef.current) {
      suppressMapPressRef.current = false
      return
    }
    setSelectedGroup(null)
  }, [])
  const handleClose = useCallback(() => setSelectedGroup(null), [])

  const handlePrev = useCallback(() => {
    setSelectedIndex((prevIndex) => Math.max(0, prevIndex - 1))
  }, [])

  const handleNext = useCallback(() => {
    setSelectedIndex((prevIndex) =>
      selectedGroup ? Math.min(selectedGroup.points.length - 1, prevIndex + 1) : prevIndex,
    )
  }, [selectedGroup])

  const selectedPoint = selectedGroup?.points[selectedIndex] ?? null

  const handleViewTrip = useCallback(() => {
    if (!selectedPoint) return
    router.push(`/(app)/trips/${selectedPoint.tripId}`)
    setSelectedGroup(null)
  }, [router, selectedPoint])

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1 },
        map: { flex: 1 },
        cardWrapper: {
          position: 'absolute',
          left: spacing[4],
          right: spacing[4],
          bottom: spacing[4],
          // MapLibre's native Android surface can otherwise win touch
          // dispatch over this RN sibling despite render order — elevation
          // is Android's actual z-ordering signal, not just tree position.
          elevation: 10,
          zIndex: 10,
        },
        cluster: {
          borderRadius: 999,
          backgroundColor: colors.primary,
          borderWidth: 3,
          borderColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        },
        clusterText: { color: '#fff', fontWeight: '600', fontSize: 14 },
      }),
    [spacing, colors.primary],
  )

  return (
    <View style={styles.container}>
      <MapLibreMap
        ref={mapRef}
        style={styles.map}
        mapStyle={mapStyleUrl()}
        onPress={handleMapPress}
        onRegionDidChange={handleRegionDidChange}
        androidView="texture"
        logoPosition={{ top: 8, left: 8 }}
        attributionPosition={{ top: 8, right: 8 }}
        compass={false}
        scaleBar={false}
      >
        <Camera ref={cameraRef} initialViewState={camera} maxZoom={MAX_ZOOM} />

        {clusters.map((feature) => {
          const [lng, lat] = toLngLat(feature.geometry.coordinates)

          if ('cluster' in feature.properties && feature.properties.cluster) {
            const cluster = feature as Supercluster.ClusterFeature<MapPoint>
            const size = clusterIconSize(cluster.properties.point_count)

            return (
              <Marker
                key={`cluster-${cluster.properties.cluster_id}`}
                lngLat={[lng, lat]}
                anchor="center"
                onPress={() => handleClusterPress(cluster)}
              >
                <View style={[styles.cluster, { width: size, height: size }]}>
                  <Text style={styles.clusterText}>{cluster.properties.point_count}</Text>
                </View>
              </Marker>
            )
          }

          const point = (feature as Supercluster.PointFeature<MapPoint>).properties

          return (
            <Marker
              key={point.id}
              lngLat={[lng, lat]}
              anchor="bottom"
              onPress={() => handlePointPress(point)}
            >
              <Svg width={PIN_SIZE} height={PIN_SIZE} viewBox="0 0 24 24">
                <Path d={PIN_PATH} fill={colors.primary} />
              </Svg>
            </Marker>
          )
        })}
      </MapLibreMap>

      {selectedGroup && selectedPoint && (
        <Animated.View
          entering={FadeInDown.duration(250).easing(Easing.out(Easing.cubic))}
          exiting={FadeOutDown.duration(180).easing(Easing.in(Easing.cubic))}
          style={styles.cardWrapper}
        >
          <MapMemoryCard
            point={selectedPoint}
            onViewTrip={handleViewTrip}
            onClose={handleClose}
            pager={
              selectedGroup.points.length > 1
                ? {
                    index: selectedIndex,
                    total: selectedGroup.points.length,
                    onPrev: handlePrev,
                    onNext: handleNext,
                  }
                : undefined
            }
          />
        </Animated.View>
      )}
    </View>
  )
}
