import { describe, expect, it } from 'vitest'
import {
  buildFlatWorldStyle,
  buildVisitedFillExpression,
  buildVisitedOpacityExpression,
  COUNTRIES_SOURCE_ID,
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
  it('produces a minimal style with no basemap tile layers', () => {
    const style = buildFlatWorldStyle(['Morocco'])
    expect(style.version).toBe(8)
    expect(Object.keys(style.sources)).toEqual([COUNTRIES_SOURCE_ID])
    expect(style.layers.map((layer) => layer.type)).toEqual(['background', 'fill', 'line'])
  })

  it('embeds the country GeoJSON inline (no network fetch at style-load time)', () => {
    const style = buildFlatWorldStyle(['Morocco'])
    const source = style.sources[COUNTRIES_SOURCE_ID]
    expect(source.type).toBe('geojson')
    expect(typeof source.data).toBe('object')
  })
})
