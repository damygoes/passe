import { describe, expect, it } from 'vitest'
import { getCountryLabelsGeoJSON } from '../countryLabels'
import { getWorldCountriesGeoJSON } from '../geo'

describe('getCountryLabelsGeoJSON', () => {
  it('produces one point feature per country, carrying the same name', () => {
    const countries = getWorldCountriesGeoJSON()
    const labels = getCountryLabelsGeoJSON()

    expect(labels.type).toBe('FeatureCollection')
    expect(labels.features).toHaveLength(countries.features.length)
    expect(labels.features.map((feature) => feature.properties.name)).toEqual(
      countries.features.map((feature) => feature.properties.name),
    )
  })

  it('places every label inside a plausible lng/lat range', () => {
    const labels = getCountryLabelsGeoJSON()
    for (const feature of labels.features) {
      const [lng, lat] = feature.geometry.coordinates
      expect(lng).toBeGreaterThanOrEqual(-180)
      expect(lng).toBeLessThanOrEqual(180)
      expect(lat).toBeGreaterThanOrEqual(-90)
      expect(lat).toBeLessThanOrEqual(90)
    }
  })

  it('places a well-known country label roughly where that country actually is', () => {
    const labels = getCountryLabelsGeoJSON()
    const france = labels.features.find((feature) => feature.properties.name === 'France')
    expect(france).toBeDefined()
    const [lng, lat] = france!.geometry.coordinates
    // Mainland France's rough bounding box — guards against the centroid
    // picking an overseas exclave/fragment instead of the largest ring.
    expect(lng).toBeGreaterThan(-5)
    expect(lng).toBeLessThan(9)
    expect(lat).toBeGreaterThan(41)
    expect(lat).toBeLessThan(51)
  })

  it('memoizes the result across calls', () => {
    expect(getCountryLabelsGeoJSON()).toBe(getCountryLabelsGeoJSON())
  })
})
