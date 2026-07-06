import { AppleMaps, GoogleMaps } from 'expo-maps'
import { useRouter } from 'expo-router'
import { useCallback, useMemo } from 'react'
import { Platform, StyleSheet } from 'react-native'

export interface MapPoint {
  id: string
  tripId: string
  lat: number
  lng: number
  city: string | null | undefined
  country: string | null | undefined
  note: string | null | undefined
}

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
  const camera = useMemo(() => computeCamera(points), [points])

  const handleMarkerClick = useCallback(
    (marker: ClickedMarker) => {
      const point = points.find((candidate) => candidate.id === marker.id)
      if (point) router.push(`/(app)/trips/${point.tripId}`)
    },
    [points, router],
  )

  if (Platform.OS === 'ios') {
    const markers = points.map((point) => ({
      id: point.id,
      coordinates: { latitude: point.lat, longitude: point.lng },
      title: [point.city, point.country].filter(Boolean).join(', ') || undefined,
      systemImage: 'mappin.circle.fill',
    }))

    return (
      <AppleMaps.View
        style={styles.map}
        cameraPosition={camera}
        markers={markers}
        onMarkerClick={handleMarkerClick}
      />
    )
  }

  if (Platform.OS === 'android') {
    const markers = points.map((point) => ({
      id: point.id,
      coordinates: { latitude: point.lat, longitude: point.lng },
      title: [point.city, point.country].filter(Boolean).join(', ') || undefined,
      snippet: point.note ?? undefined,
      showCallout: true,
    }))

    return (
      <GoogleMaps.View
        style={styles.map}
        cameraPosition={camera}
        markers={markers}
        onMarkerClick={handleMarkerClick}
      />
    )
  }

  return null
}

const styles = StyleSheet.create({
  map: { flex: 1 },
})
