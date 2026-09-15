'use client'

import 'maplibre-gl/dist/maplibre-gl.css'
import './map-popup.css'

import {
  buildFlatWorldStyle,
  MAP_PIN_COLOR,
  MAP_PIN_HALO_COLOR,
  MAP_PIN_HALO_OPACITY,
  MAP_PIN_RING_COLOR,
} from '@passe/map'
import type { MapPoint } from '@passe/types/memory'
import type { StyleSpecification } from 'maplibre-gl'
import { useCallback, useMemo, useRef, useState } from 'react'
import Map, { Marker, Popup, type MapRef, type MarkerEvent } from 'react-map-gl/maplibre'
import Supercluster from 'supercluster'
import { MapMemoryPopup } from './MapMemoryPopup'

interface WorldMapProps {
  points: MapPoint[]
  /** Free-text country names from the user's trips — drives the choropleth fill. */
  visitedCountries: string[]
}

// No vector/raster tiles anymore — the flat GeoJSON fill scales to any zoom,
// so this only needs to stay at or above Supercluster's own maxZoom (16)
// below so a cluster's expansion zoom is never clamped short of separating
// its pins, while still keeping "zoom in" from going anywhere meaningfully
// further on a flat polygon.
const MAX_ZOOM = 16
const PIN_SIZE = 18
const PIN_HALO_SIZE = PIN_SIZE * 2.6
const CLUSTER_RADIUS = 60

function computeBounds(points: MapPoint[]): [[number, number], [number, number]] {
  const bounds = points.reduce(
    (acc, point) => ({
      minLng: Math.min(acc.minLng, point.lng),
      maxLng: Math.max(acc.maxLng, point.lng),
      minLat: Math.min(acc.minLat, point.lat),
      maxLat: Math.max(acc.maxLat, point.lat),
    }),
    { minLng: Infinity, maxLng: -Infinity, minLat: Infinity, maxLat: -Infinity },
  )

  return [
    [bounds.minLng, bounds.minLat],
    [bounds.maxLng, bounds.maxLat],
  ]
}

// GeoJSON `Position` types as `number[]`, so indexed access loses the
// fixed-length tuple guarantee under `noUncheckedIndexedAccess`. Coordinates
// always come back as [lng, lat] pairs from Supercluster's own output.
function toLngLat(coordinates: number[]): [number, number] {
  return [coordinates[0] ?? 0, coordinates[1] ?? 0]
}

function clusterIconSize(count: number) {
  if (count <= 9) return 36
  if (count <= 49) return 44
  return 52
}

// Flat olive dot + 16%-opacity halo + white ring, per the design's city-pin
// spec — replaces the previous teardrop glyph now that the basemap itself is
// flat too. Anchored center (not bottom) since a concentric dot has no "tip".
function MapPin() {
  return (
    <div
      style={{
        width: PIN_HALO_SIZE,
        height: PIN_HALO_SIZE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: PIN_HALO_SIZE,
          height: PIN_HALO_SIZE,
          borderRadius: '50%',
          background: MAP_PIN_HALO_COLOR,
          opacity: MAP_PIN_HALO_OPACITY,
        }}
      />
      <div
        style={{
          width: PIN_SIZE,
          height: PIN_SIZE,
          borderRadius: '50%',
          background: MAP_PIN_COLOR,
          border: `1px solid ${MAP_PIN_RING_COLOR}`,
        }}
      />
    </div>
  )
}

// Same olive family as individual pins (just bigger, with a count) — the
// design doesn't specify clustering, but pins and clusters should still read
// as one glyph family rather than clusters reintroducing the old terracotta.
function ClusterBubble({ count }: { count: number }) {
  const size = clusterIconSize(count)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        background: MAP_PIN_COLOR,
        border: `2px solid ${MAP_PIN_RING_COLOR}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
        color: MAP_PIN_RING_COLOR,
        fontWeight: 600,
        fontSize: 14,
      }}
    >
      {count}
    </div>
  )
}

interface Viewport {
  zoom: number
  bbox: [number, number, number, number]
}

interface SelectedGroup {
  key: string
  lat: number
  lng: number
  points: MapPoint[]
}

export function WorldMap({ points, visitedCountries }: WorldMapProps) {
  const mapRef = useRef<MapRef>(null)
  const [selectedGroup, setSelectedGroup] = useState<SelectedGroup | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [viewport, setViewport] = useState<Viewport | null>(null)

  const bounds = useMemo(() => computeBounds(points), [points])
  const mapStyle = useMemo(
    () => buildFlatWorldStyle(visitedCountries) as unknown as StyleSpecification,
    [visitedCountries],
  )

  // Proximity-based clustering (same engine react-map-gl's own clustering
  // examples use) — recomputed only when the point set changes; queried
  // against the live viewport on every move.
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

  const syncViewport = useCallback(() => {
    const map = mapRef.current
    if (!map) return
    const mapBounds = map.getBounds()
    setViewport({
      zoom: Math.round(map.getZoom()),
      bbox: [mapBounds.getWest(), mapBounds.getSouth(), mapBounds.getEast(), mapBounds.getNorth()],
    })
  }, [])

  const clusters = viewport ? index.getClusters(viewport.bbox, viewport.zoom) : []

  const handleClusterClick = useCallback(
    (event: MarkerEvent<MouseEvent>, cluster: Supercluster.ClusterFeature<MapPoint>) => {
      event.originalEvent.stopPropagation()
      const map = mapRef.current
      if (!map) return
      const [lng, lat] = toLngLat(cluster.geometry.coordinates)
      const rawExpansionZoom = index.getClusterExpansionZoom(cluster.properties.cluster_id)
      const expansionZoom = Math.min(rawExpansionZoom, MAX_ZOOM)
      map.easeTo({ center: [lng, lat], zoom: expansionZoom, duration: 300 })

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

  const handlePointClick = useCallback((event: MarkerEvent<MouseEvent>, point: MapPoint) => {
    event.originalEvent.stopPropagation()
    setSelectedGroup({ key: point.id, lat: point.lat, lng: point.lng, points: [point] })
    setSelectedIndex(0)
  }, [])

  const handlePrev = useCallback(() => {
    setSelectedIndex((prevIndex) => Math.max(0, prevIndex - 1))
  }, [])

  const handleNext = useCallback(() => {
    setSelectedIndex((prevIndex) =>
      selectedGroup ? Math.min(selectedGroup.points.length - 1, prevIndex + 1) : prevIndex,
    )
  }, [selectedGroup])

  const selectedPoint = selectedGroup?.points[selectedIndex] ?? null

  return (
    <div className="h-[calc(100svh-300px)] min-h-[420px] w-full overflow-hidden rounded-[26px]">
      <Map
        ref={mapRef}
        initialViewState={{
          bounds,
          fitBoundsOptions: { padding: 40, maxZoom: 12 },
        }}
        maxZoom={MAX_ZOOM}
        mapStyle={mapStyle}
        onLoad={syncViewport}
        onMoveEnd={syncViewport}
        style={{ width: '100%', height: '100%' }}
      >
        {clusters.map((feature) => {
          const [lng, lat] = toLngLat(feature.geometry.coordinates)

          if ('cluster' in feature.properties && feature.properties.cluster) {
            const cluster = feature as Supercluster.ClusterFeature<MapPoint>
            return (
              <Marker
                key={`cluster-${cluster.properties.cluster_id}`}
                longitude={lng}
                latitude={lat}
                anchor="center"
                onClick={(event) => handleClusterClick(event, cluster)}
              >
                <ClusterBubble count={cluster.properties.point_count} />
              </Marker>
            )
          }

          const point = (feature as Supercluster.PointFeature<MapPoint>).properties

          return (
            <Marker
              key={point.id}
              longitude={lng}
              latitude={lat}
              anchor="center"
              onClick={(event) => handlePointClick(event, point)}
            >
              <MapPin />
            </Marker>
          )
        })}

        {selectedGroup && selectedPoint && (
          <Popup
            longitude={selectedGroup.lng}
            latitude={selectedGroup.lat}
            anchor="bottom"
            offset={PIN_HALO_SIZE / 2 + 4}
            closeButton={false}
            closeOnClick={false}
            onClose={() => setSelectedGroup(null)}
          >
            <MapMemoryPopup
              point={selectedPoint}
              onClose={() => setSelectedGroup(null)}
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
          </Popup>
        )}
      </Map>
    </div>
  )
}
