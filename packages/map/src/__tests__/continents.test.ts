import { describe, expect, it } from 'vitest'
import { getContinentLabelsGeoJSON } from '../continents'

describe('getContinentLabelsGeoJSON', () => {
  it('returns a point per continent with a name', () => {
    const geojson = getContinentLabelsGeoJSON()
    expect(geojson.type).toBe('FeatureCollection')
    expect(geojson.features.length).toBeGreaterThan(0)
    for (const feature of geojson.features) {
      expect(feature.geometry.type).toBe('Point')
      expect(typeof feature.properties.name).toBe('string')
      expect(feature.geometry.coordinates).toHaveLength(2)
    }
  })

  it('includes the major continents', () => {
    const names = getContinentLabelsGeoJSON().features.map((feature) => feature.properties.name)
    expect(names).toEqual(
      expect.arrayContaining(['Africa', 'Asia', 'Europe', 'North America', 'South America']),
    )
  })
})
