'use client'

import '@maptiler/sdk/style.css'
import 'leaflet/dist/leaflet.css'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css'

import { Language, MapStyle, MaptilerLayer } from '@maptiler/leaflet-maptilersdk'
import type { MapPoint } from '@passe/types/memory'
import { Icon } from '@passe/ui/icon'
import { divIcon, type LatLngTuple } from 'leaflet'
import { useEffect } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MapContainer, Marker, Popup, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { MapMemoryPopup } from './MapMemoryPopup'

interface WorldMapProps {
  points: MapPoint[]
}

// Vector tiles top out well below 22 — without an explicit maxZoom, Leaflet
// has nothing to fall back to once the raster `<TileLayer>` (which used to
// supply one implicitly) is gone, and throws "Map has no maxZoom specified".
const MAX_ZOOM = 19

// Vector basemap rendered via MapTiler SDK (production-grade tile infra, not
// the OSM community demo server). `Language.AUTO` reads the viewer's own
// browser language, so labels are localized per-visitor with no extra code.
// `MapStyle.STREETS_V4` is pinned explicitly — the `STREETS` alias still
// defaults to the deprecated "streets-v2" style, which MapTiler's servers
// reject and silently fall back from.
function MapTilerBaseLayer() {
  const map = useMap()

  useEffect(() => {
    const layer = new MaptilerLayer({
      apiKey: process.env.NEXT_PUBLIC_MAPTILER_KEY ?? '',
      style: MapStyle.STREETS_V4,
      language: Language.AUTO,
    }).addTo(map)

    return () => {
      layer.remove()
    }
  }, [map])

  return null
}

const PIN_SIZE = 40

// Custom pin instead of Leaflet's default marker images, which need
// per-bundler asset-path fixes to resolve correctly under Next.js/Turbopack.
// The teardrop background is rotated for the classic pin shape; the icon
// glyph sits in a non-rotated layer on top so it stays upright.
const pinIcon = divIcon({
  className: 'passe-map-pin',
  html: `
    <div style="position:relative;width:${PIN_SIZE}px;height:${PIN_SIZE}px;">
      <span style="position:absolute;inset:0;border-radius:50% 50% 50% 0;background:var(--color-primary);transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,0.4);"></span>
      <span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
        ${renderToStaticMarkup(<Icon name="location" size="md" color="#fff" />)}
      </span>
    </div>
  `,
  iconSize: [PIN_SIZE, PIN_SIZE],
  iconAnchor: [PIN_SIZE / 2, PIN_SIZE],
  popupAnchor: [0, -PIN_SIZE + 4],
})

interface ClusterLike {
  getChildCount: () => number
}

function clusterIconSize(count: number) {
  if (count <= 9) return 36
  if (count <= 49) return 44
  return 52
}

// Brand-colored replacement for the plugin's default green/yellow/orange
// circles, which blend into the basemap's own green landcover shading.
function createClusterIcon(cluster: ClusterLike) {
  const count = cluster.getChildCount()
  const size = clusterIconSize(count)

  return divIcon({
    className: 'passe-map-cluster',
    html: `
      <div style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:50%;background:var(--color-primary);border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.4);color:#fff;font-weight:600;font-size:14px;">
        ${count}
      </div>
    `,
    iconSize: [size, size],
  })
}

export function WorldMap({ points }: WorldMapProps) {
  const bounds: LatLngTuple[] = points.map((point) => [point.lat, point.lng])

  return (
    <div className="h-[80vh] w-full overflow-hidden rounded-xl border">
      <MapContainer
        bounds={bounds}
        boundsOptions={{ padding: [40, 40], maxZoom: 12 }}
        maxZoom={MAX_ZOOM}
        scrollWheelZoom
        className="h-full w-full"
      >
        <MapTilerBaseLayer />
        <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterIcon}>
          {points.map((point) => (
            <Marker key={point.id} position={[point.lat, point.lng]} icon={pinIcon}>
              <Popup>
                <MapMemoryPopup point={point} />
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  )
}
