import { describe, expect, it } from 'vitest'
import {
  buildFlatWorldStyle,
  buildVisitedFillExpression,
  buildVisitedOpacityExpression,
  CONTINENT_LABELS_LAYER_ID,
  CONTINENT_LABELS_SOURCE_ID,
  COUNTRIES_SOURCE_ID,
  COUNTRY_LABELS_LAYER_ID,
  COUNTRY_LABELS_SOURCE_ID,
} from '../style'

describe('buildVisitedFillExpression', () => {
  it('matches visited countries to the terracotta fill', () => {
    const expression = buildVisitedFillExpression(['Morocco', 'Japan'])
    expect(expression).toEqual([
      'match',
      ['get', 'name'],
      ['Morocco', 'Japan'],
      '#C4622D',
      '#D9C4A0',
    ])
  })

  it('normalizes aliases before matching', () => {
    const expression = buildVisitedFillExpression(['USA'])
    expect(expression).toEqual([
      'match',
      ['get', 'name'],
      ['United States of America'],
      '#C4622D',
      '#D9C4A0',
    ])
  })

  it('dedupes repeated country names', () => {
    const expression = buildVisitedFillExpression(['Morocco', 'Morocco', 'morocco'])
    expect(expression).toEqual(['match', ['get', 'name'], ['Morocco'], '#C4622D', '#D9C4A0'])
  })

  it('falls back to an unvisited-only literal when nothing is visited', () => {
    expect(buildVisitedFillExpression([])).toEqual(['literal', '#D9C4A0'])
  })
})

describe('buildVisitedOpacityExpression', () => {
  it('is fully opaque for visited countries, 0.55 otherwise', () => {
    const expression = buildVisitedOpacityExpression(['Morocco'])
    expect(expression).toEqual(['match', ['get', 'name'], ['Morocco'], 1, 0.55])
  })
})

describe('buildFlatWorldStyle', () => {
  it('produces a style with no basemap tile layers, just fills, borders and labels', () => {
    const style = buildFlatWorldStyle(['Morocco'])
    expect(style.version).toBe(8)
    expect(Object.keys(style.sources)).toEqual([
      COUNTRIES_SOURCE_ID,
      COUNTRY_LABELS_SOURCE_ID,
      CONTINENT_LABELS_SOURCE_ID,
    ])
    expect(style.layers.map((layer) => layer.type)).toEqual([
      'background',
      'fill',
      'line',
      'symbol',
      'symbol',
    ])
  })

  it('embeds the country GeoJSON inline (no network fetch at style-load time)', () => {
    const style = buildFlatWorldStyle(['Morocco'])
    const source = style.sources[COUNTRIES_SOURCE_ID]
    expect(source.type).toBe('geojson')
    expect(typeof source.data).toBe('object')
  })

  it('points at a key-free glyph server so country/continent labels can render', () => {
    const style = buildFlatWorldStyle(['Morocco'])
    expect(style.glyphs).toContain('{fontstack}')
    expect(style.glyphs).toContain('{range}')
  })

  it('sources country name labels from a dedicated point source, not the polygon source', () => {
    const style = buildFlatWorldStyle(['Morocco'])
    const labelLayer = style.layers.find((layer) => layer.id === COUNTRY_LABELS_LAYER_ID)
    expect(labelLayer?.source).toBe(COUNTRY_LABELS_SOURCE_ID)
    expect(labelLayer?.layout?.['text-field']).toEqual(['get', 'name'])
    const source = style.sources[COUNTRY_LABELS_SOURCE_ID]
    expect(source.type).toBe('geojson')
  })

  it('renders continent labels from a dedicated point source', () => {
    const style = buildFlatWorldStyle(['Morocco'])
    const source = style.sources[CONTINENT_LABELS_SOURCE_ID]
    expect(source.type).toBe('geojson')
    const layer = style.layers.find((layer) => layer.id === CONTINENT_LABELS_LAYER_ID)
    expect(layer?.source).toBe(CONTINENT_LABELS_SOURCE_ID)
  })
})
