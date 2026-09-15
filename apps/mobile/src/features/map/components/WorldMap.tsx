import type { MapPoint } from '@passe/types/memory'
import {
  buildFlatWorldStyle,
  MAP_PIN_COLOR,
  MAP_PIN_HALO_COLOR,
  MAP_PIN_HALO_OPACITY,
  MAP_PIN_RING_COLOR,
} from '@passe/map'
import {
  Camera,
  Map as MapLibreMap,
  Marker,
  type CameraRef,
  type MapRef,
  type StyleSpecification,
} from '@maplibre/maplibre-react-native'
import { useRouter } from 'expo-router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, { Easing, FadeInDown, FadeOutDown } from 'react-native-reanimated'
import Supercluster from 'supercluster'

import { useTheme } from '@/hooks/useTheme'
import { MapMemoryCard } from './MapMemoryCard'
import { groupPointsByLocation, type LocationGroup } from '../utils/groupPointsByLocation'

interface WorldMapProps {
  points: MapPoint[]
  /** Free-text country names from the user's trips — drives the choropleth fill. */
  visitedCountries: string[]
}

// No vector/raster tiles anymore — the flat GeoJSON fill scales to any zoom,
// so this only needs to stay at or above Supercluster's own maxZoom (16)
// below so a cluster's expansion zoom is never clamped short of separating
// its pins. Mirrors apps/web WorldMap.tsx.
const MAX_ZOOM = 16
const PIN_SIZE = 18
const PIN_HALO_SIZE = PIN_SIZE * 2.6
const CLUSTER_RADIUS = 60
// The World map screen embeds this in a fixed-height band, not full-bleed —
// matches the rounded corner apps/web's WorldMap uses.
const MAP_RADIUS = 26

// A single center + zoom heuristic instead of a bounds-fit — fitting bounds
// around a single point (or several at the same spot) degenerates to a
// near-zero-size box, which drives the camera to an absurd zoom level.
function computeCamera(points: MapPoint[]) {
  const avgLat = points.reduce((sum, point) => sum + point.lat, 0) / points.length
  const avgLng = points.reduce((sum, point) => sum + point.lng, 0) / points.length
  const latSpread =
    Math.max(...points.map((point) => point.lat)) - Math.min(...points.map((point) => point.lat))
  const lngSpread =
    Math.max(...points.map((point) => point.lng)) - Math.min(...points.map((point) => point.lng))
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

export function WorldMap({ points, visitedCountries }: WorldMapProps) {
  const router = useRouter()
  const { spacing } = useTheme()
  const mapRef = useRef<MapRef>(null)
  const cameraRef = useRef<CameraRef>(null)

  const camera = useMemo(() => computeCamera(points), [points])
  const mapStyle = useMemo(
    () => buildFlatWorldStyle(visitedCountries) as unknown as StyleSpecification,
    [visitedCountries],
  )
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
      const rawExpansionZoom = index.getClusterExpansionZoom(cluster.properties.cluster_id)
      const expansionZoom = Math.min(rawExpansionZoom, MAX_ZOOM)
      cameraRef.current?.easeTo({ center: [lng, lat], zoom: expansionZoom, duration: 300 })

      // The cluster can never separate further within the app's zoom range (either the
      // points are exactly coincident, or just close enough to still need zoom >= MAX_ZOOM) —
      // fall back to showing its points directly instead of leaving the camera "stuck".
      if (rawExpansionZoom >= MAX_ZOOM) {
        const leaves = index.getLeaves(cluster.properties.cluster_id, Infinity)
        setSelectedGroup({
          key: `cluster-${cluster.properties.cluster_id}`,
          lat,
          lng,
          points: leaves.map((leaf) => leaf.properties),
        })
        setSelectedIndex(0)
      }
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
        // Clipping lives on this outer plain View, not on the `map` style
        // prop below — applying borderRadius/overflow directly to
        // MapLibreMap's own style risks breaking its native Metal/GL
        // rendering surface on iOS (the layer that actually paints the
        // flat-fill GeoJSON), where this outer RN View has no such risk.
        container: { flex: 1, borderRadius: MAP_RADIUS, overflow: 'hidden' },
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
        // Same olive family as individual pins (just bigger, with a count) —
        // the design doesn't specify clustering, but pins and clusters
        // should still read as one glyph family.
        cluster: {
          borderRadius: 999,
          backgroundColor: MAP_PIN_COLOR,
          borderWidth: 2,
          borderColor: MAP_PIN_RING_COLOR,
          alignItems: 'center',
          justifyContent: 'center',
        },
        clusterText: { color: MAP_PIN_RING_COLOR, fontWeight: '600', fontSize: 14 },
        pinHalo: {
          position: 'absolute',
          width: PIN_HALO_SIZE,
          height: PIN_HALO_SIZE,
          borderRadius: PIN_HALO_SIZE / 2,
          backgroundColor: MAP_PIN_HALO_COLOR,
          opacity: MAP_PIN_HALO_OPACITY,
        },
        pinDot: {
          width: PIN_SIZE,
          height: PIN_SIZE,
          borderRadius: PIN_SIZE / 2,
          backgroundColor: MAP_PIN_COLOR,
          borderWidth: 1,
          borderColor: MAP_PIN_RING_COLOR,
        },
        pinWrapper: {
          width: PIN_HALO_SIZE,
          height: PIN_HALO_SIZE,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }),
    [spacing],
  )

  return (
    <View style={styles.container}>
      <MapLibreMap
        ref={mapRef}
        style={styles.map}
        mapStyle={mapStyle}
        onPress={handleMapPress}
        onRegionDidChange={handleRegionDidChange}
        androidView="texture"
        logoPosition={{ bottom: 8, left: 8 }}
        attributionPosition={{ bottom: 8, right: 8 }}
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
              anchor="center"
              onPress={() => handlePointPress(point)}
            >
              <View style={styles.pinWrapper}>
                <View style={styles.pinHalo} />
                <View style={styles.pinDot} />
              </View>
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
