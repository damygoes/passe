import { describe, expect, it } from 'vitest'
import { normalizeCountryName } from '../countries'
import { getWorldCountriesGeoJSON } from '../geo'

describe('normalizeCountryName', () => {
  it('maps common aliases to their exact Natural Earth name', () => {
    expect(normalizeCountryName('USA')).toBe('United States of America')
    expect(normalizeCountryName('usa')).toBe('United States of America')
    expect(normalizeCountryName('United States')).toBe('United States of America')
    expect(normalizeCountryName('UK')).toBe('United Kingdom')
    expect(normalizeCountryName('Czech Republic')).toBe('Czechia')
    expect(normalizeCountryName('Ivory Coast')).toBe("Côte d'Ivoire")
  })

  it('is case-insensitive and trims whitespace', () => {
    expect(normalizeCountryName('  usa  ')).toBe('United States of America')
    expect(normalizeCountryName('Uk')).toBe('United Kingdom')
  })

  it('canonicalizes casing even for names not in the alias table', () => {
    expect(normalizeCountryName('morocco')).toBe('Morocco')
    expect(normalizeCountryName('MOROCCO')).toBe('Morocco')
    expect(normalizeCountryName('japan')).toBe('Japan')
  })

  it('passes through names that already match exactly', () => {
    expect(normalizeCountryName('Morocco')).toBe('Morocco')
    expect(normalizeCountryName('Japan')).toBe('Japan')
  })

  it('passes through unknown names unchanged (not silently dropped)', () => {
    expect(normalizeCountryName('Wakanda')).toBe('Wakanda')
  })

  it('every alias target actually exists in the bundled GeoJSON', () => {
    const geo = getWorldCountriesGeoJSON()
    const names = new Set(geo.features.map((feature) => feature.properties.name))
    const aliasTargets = [
      normalizeCountryName('USA'),
      normalizeCountryName('UK'),
      normalizeCountryName('Czech Republic'),
      normalizeCountryName('Ivory Coast'),
      normalizeCountryName('Bosnia'),
      normalizeCountryName('DR Congo'),
      normalizeCountryName('North Macedonia'),
      normalizeCountryName('Eswatini'),
      normalizeCountryName('Burma'),
      normalizeCountryName('South Sudan'),
      normalizeCountryName('UAE'),
    ]
    for (const target of aliasTargets) {
      expect(names.has(target)).toBe(true)
    }
  })
})
