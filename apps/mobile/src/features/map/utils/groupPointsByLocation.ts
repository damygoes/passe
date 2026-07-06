import type { MapPoint } from '@passe/types/memory'

export interface LocationGroup {
  key: string
  lat: number
  lng: number
  points: MapPoint[]
}

// Rounding to 5 decimal places (~1.1m) treats points as "the same location" only
// when effectively identical — not a general radius-based cluster.
const LOCATION_PRECISION = 5

export function groupPointsByLocation(points: MapPoint[]): LocationGroup[] {
  const groups = new Map<string, LocationGroup>()

  for (const point of points) {
    const lat = Number(point.lat.toFixed(LOCATION_PRECISION))
    const lng = Number(point.lng.toFixed(LOCATION_PRECISION))
    const key = `${lat},${lng}`

    const existing = groups.get(key)
    if (existing) {
      existing.points.push(point)
    } else {
      groups.set(key, { key, lat, lng, points: [point] })
    }
  }

  return Array.from(groups.values())
}
