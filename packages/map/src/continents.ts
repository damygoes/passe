import type { Feature, FeatureCollection, Point } from 'geojson'

export interface ContinentLabelProperties {
  name: string
}

export type ContinentLabelFeature = Feature<Point, ContinentLabelProperties>
export type ContinentLabelsFeatureCollection = FeatureCollection<Point, ContinentLabelProperties>

// Hand-placed label points (not centroids — nudged to sit in open ocean/land
// space away from dense country clusters, the same way a printed atlas
// places continent names) for the low-zoom "which part of the world is
// this" labels shown before individual country names take over.
const CONTINENT_LABELS: { name: string; lng: number; lat: number }[] = [
  { name: 'North America', lng: -100, lat: 45 },
  { name: 'South America', lng: -60, lat: -18 },
  { name: 'Europe', lng: 15, lat: 52 },
  { name: 'Africa', lng: 20, lat: 3 },
  { name: 'Asia', lng: 90, lat: 48 },
  { name: 'Oceania', lng: 135, lat: -25 },
]

export function getContinentLabelsGeoJSON(): ContinentLabelsFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: CONTINENT_LABELS.map(({ name, lng, lat }) => ({
      type: 'Feature',
      properties: { name },
      geometry: { type: 'Point', coordinates: [lng, lat] },
    })),
  }
}
