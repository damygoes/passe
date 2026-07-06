import type { MapPoint } from '@passe/types/memory'
import { AppleMaps, GoogleMaps } from 'expo-maps'
import { useRouter } from 'expo-router'
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import { useTheme } from '@/hooks/useTheme'
import { MapMemoryCard } from './MapMemoryCard'

interface WorldMapProps {
  points: MapPoint[]
}

interface ClickedMarker {
  id?: string
}

function computeCamera(points: MapPoint[]) {
  const avgLat = points.reduce((sum, point) => sum + point.lat, 0) / points.length
  const avgLng = points.reduce((sum, point) => sum + point.lng, 0) / points.length
  const latSpread = Math.max(...points.map((point) => point.lat)) - Math.min(...points.map((point) => point.lat))
  const lngSpread = Math.max(...points.map((point) => point.lng)) - Math.min(...points.map((point) => point.lng))
  const maxSpread = Math.max(latSpread, lngSpread)
  const zoom = maxSpread < 0.5 ? 10 : maxSpread < 5 ? 6 : maxSpread < 20 ? 4 : 2

  return { coordinates: { latitude: avgLat, longitude: avgLng }, zoom }
}

export function WorldMap({ points }: WorldMapProps) {
  const router = useRouter()
  const { spacing } = useTheme()
  const camera = useMemo(() => computeCamera(points), [points])
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null)

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
        },
      }),
    [spacing],
  )

  const handleMarkerClick = useCallback(
    (marker: ClickedMarker) => {
      const point = points.find((candidate) => candidate.id === marker.id)
      if (point) setSelectedPoint(point)
    },
    [points],
  )

  const handleMapClick = useCallback(() => setSelectedPoint(null), [])

  const handleViewTrip = useCallback(() => {
    if (!selectedPoint) return
    router.push(`/(app)/trips/${selectedPoint.tripId}`)
    setSelectedPoint(null)
  }, [router, selectedPoint])

  const handleClose = useCallback(() => setSelectedPoint(null), [])

  let map: ReactNode = null

  if (Platform.OS === 'ios') {
    const markers = points.map((point) => ({
      id: point.id,
      coordinates: { latitude: point.lat, longitude: point.lng },
      systemImage: 'mappin.circle.fill',
    }))

    map = (
      <AppleMaps.View
        style={styles.map}
        cameraPosition={camera}
        markers={markers}
        onMarkerClick={handleMarkerClick}
        onMapClick={handleMapClick}
      />
    )
  } else if (Platform.OS === 'android') {
    const markers = points.map((point) => ({
      id: point.id,
      coordinates: { latitude: point.lat, longitude: point.lng },
    }))

    map = (
      <GoogleMaps.View
        style={styles.map}
        cameraPosition={camera}
        markers={markers}
        onMarkerClick={handleMarkerClick}
        onMapClick={handleMapClick}
      />
    )
  }

  if (!map) return null

  return (
    <View style={styles.container}>
      {map}
      {selectedPoint && (
        <View style={styles.cardWrapper}>
          <MapMemoryCard point={selectedPoint} onViewTrip={handleViewTrip} onClose={handleClose} />
        </View>
      )}
    </View>
  )
}
