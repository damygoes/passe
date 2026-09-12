import { describe, expect, it } from 'vitest'
import { getWorldCountriesGeoJSON } from '../geo'

describe('getWorldCountriesGeoJSON', () => {
  it('returns a FeatureCollection of country polygons', () => {
    const geo = getWorldCountriesGeoJSON()
    expect(geo.type).toBe('FeatureCollection')
    expect(geo.features.length).toBeGreaterThan(150)
  })

  it('every feature has a name and a Polygon/MultiPolygon geometry', () => {
    const geo = getWorldCountriesGeoJSON()
    for (const feature of geo.features) {
      expect(typeof feature.properties.name).toBe('string')
      expect(feature.properties.name.length).toBeGreaterThan(0)
      expect(['Polygon', 'MultiPolygon']).toContain(feature.geometry.type)
    }
  })

  it('includes the sample countries the design handoff uses', () => {
    const geo = getWorldCountriesGeoJSON()
    const names = new Set(geo.features.map((feature) => feature.properties.name))
    for (const country of [
      'Morocco',
      'Portugal',
      'Spain',
      'France',
      'Italy',
      'Greece',
      'Japan',
      'Vietnam',
      'Iceland',
      'Norway',
      'Mexico',
      'Peru',
    ]) {
      expect(names.has(country)).toBe(true)
    }
  })
})
