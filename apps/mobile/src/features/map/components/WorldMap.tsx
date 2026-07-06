import type { MapPoint } from '@passe/types/memory'
import { AppleMaps, GoogleMaps } from 'expo-maps'
import { useRouter } from 'expo-router'
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import Animated, { Easing, FadeInDown, FadeOutDown } from 'react-native-reanimated'

import { useTheme } from '@/hooks/useTheme'
import { MapMemoryCard } from './MapMemoryCard'
import { groupPointsByLocation, type LocationGroup } from '../utils/groupPointsByLocation'
import { bucketKeyForCount, useMapPinIcons } from '../utils/useMapPinIcons'

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
  const groups = useMemo(() => groupPointsByLocation(points), [points])
  const counts = useMemo(() => groups.map((group) => group.points.length), [groups])
  const { icons, pending } = useMapPinIcons(counts)

  const [selectedGroup, setSelectedGroup] = useState<LocationGroup | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

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
      const group = groups.find((candidate) => candidate.key === marker.id)
      if (group) {
        setSelectedGroup(group)
        setSelectedIndex(0)
      }
    },
    [groups],
  )

  const handleMapClick = useCallback(() => setSelectedGroup(null), [])

  const selectedPoint = selectedGroup?.points[selectedIndex] ?? null

  const handleViewTrip = useCallback(() => {
    if (!selectedPoint) return
    router.push(`/(app)/trips/${selectedPoint.tripId}`)
    setSelectedGroup(null)
  }, [router, selectedPoint])

  const handleClose = useCallback(() => setSelectedGroup(null), [])

  const handlePrev = useCallback(() => {
    setSelectedIndex((index) => Math.max(0, index - 1))
  }, [])

  const handleNext = useCallback(() => {
    setSelectedIndex((index) => (selectedGroup ? Math.min(selectedGroup.points.length - 1, index + 1) : index))
  }, [selectedGroup])

  let map: ReactNode = null

  if (Platform.OS === 'ios') {
    const annotations = groups.flatMap((group) => {
      const icon = icons[bucketKeyForCount(group.points.length)]
      if (!icon) return []
      return [
        {
          id: group.key,
          coordinates: { latitude: group.lat, longitude: group.lng },
          icon,
        },
      ]
    })

    map = (
      <AppleMaps.View
        style={styles.map}
        cameraPosition={camera}
        annotations={annotations}
        onAnnotationClick={handleMarkerClick}
        onMapClick={handleMapClick}
      />
    )
  } else if (Platform.OS === 'android') {
    const markers = groups.flatMap((group) => {
      const icon = icons[bucketKeyForCount(group.points.length)]
      if (!icon) return []
      return [
        {
          id: group.key,
          coordinates: { latitude: group.lat, longitude: group.lng },
          icon,
          anchor: { x: 0.5, y: 1 },
        },
      ]
    })

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
      {pending}
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
