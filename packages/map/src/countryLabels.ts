import type { Feature, FeatureCollection, Point, Polygon, Position } from 'geojson'
import { getWorldCountriesGeoJSON } from './geo'

export interface CountryLabelProperties {
  name: string
}

export type CountryLabelFeature = Feature<Point, CountryLabelProperties>
export type CountryLabelsFeatureCollection = FeatureCollection<Point, CountryLabelProperties>

// Signed area (shoelace formula) of a single ring — sign indicates winding
// direction, magnitude is what "largest ring" comparisons use below.
function ringArea(ring: Position[]): number {
  let sum = 0
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i] as [number, number]
    const [x2, y2] = ring[i + 1] as [number, number]
    sum += x1 * y2 - x2 * y1
  }
  return sum / 2
}

// Polygon centroid via the shoelace formula, in lng/lat space. Not
// geographically precise (no spherical correction) and can land slightly
// off-shape for a very concave coastline, but that's fine for a text label
// anchor — nowhere near the precision the choropleth fill itself needs.
function ringCentroid(ring: Position[]): [number, number] {
  const area = ringArea(ring)
  if (area === 0) {
    // Degenerate ring (e.g. a single repeated point) — fall back to the
    // plain average of its points rather than dividing by zero.
    let sx = 0
    let sy = 0
    for (const point of ring) {
      sx += (point[0] as number) ?? 0
      sy += (point[1] as number) ?? 0
    }
    return [sx / ring.length, sy / ring.length]
  }
  let cx = 0
  let cy = 0
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i] as [number, number]
    const [x2, y2] = ring[i + 1] as [number, number]
    const cross = x1 * y2 - x2 * y1
    cx += (x1 + x2) * cross
    cy += (y1 + y2) * cross
  }
  return [cx / (6 * area), cy / (6 * area)]
}

// A country can be a MultiPolygon (islands, exclaves) — label it at the
// centroid of its single largest ring by area, not the average of every
// fragment (which for e.g. an archipelago can land in open ocean between
// islands rather than on any actual landmass).
function largestRingCentroid(rings: Position[][][]): [number, number] {
  let best: { ring: Position[]; area: number } | null = null
  for (const polygon of rings) {
    const outerRing = polygon[0]
    if (!outerRing) continue
    const area = Math.abs(ringArea(outerRing))
    if (!best || area > best.area) best = { ring: outerRing, area }
  }
  return best ? ringCentroid(best.ring) : [0, 0]
}

let cached: CountryLabelsFeatureCollection | null = null

// A label anchor point per country, computed once from the same polygon
// data the choropleth renders — used instead of letting MapLibre derive a
// symbol anchor directly from the polygon source, which (at least on the
// native/iOS renderer) never placed any text for this dataset's complex
// multi-ring country shapes. A plain point source, exactly like the
// continent labels, renders reliably instead.
export function getCountryLabelsGeoJSON(): CountryLabelsFeatureCollection {
  if (cached) return cached

  const countries = getWorldCountriesGeoJSON()
  cached = {
    type: 'FeatureCollection',
    features: countries.features.map((feature) => {
      const rings: Position[][][] =
        feature.geometry.type === 'Polygon'
          ? [(feature.geometry as Polygon).coordinates]
          : feature.geometry.coordinates
      const [lng, lat] = largestRingCentroid(rings)
      return {
        type: 'Feature',
        properties: { name: feature.properties.name },
        geometry: { type: 'Point', coordinates: [lng, lat] },
      }
    }),
  }
  return cached
}
