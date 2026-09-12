import { colors } from '@passe/theme'
import { normalizeCountryName } from './countries'
import { getWorldCountriesGeoJSON } from './geo'

// The unvisited-land tint is a map-specific shade from the design handoff —
// distinct from (slightly darker than) the sandyBeige brand token, so it's a
// literal here rather than pulled from @passe/theme.
const UNVISITED_LAND = '#D9C4A0'
const VISITED_FILL = colors.terracotta.DEFAULT
const COUNTRY_STROKE = colors.sandyBeige.DEFAULT
const UNVISITED_OPACITY = 0.55
const STROKE_WIDTH = 0.7

export const MAP_PIN_COLOR = colors.deepOlive.DEFAULT
export const MAP_PIN_HALO_COLOR = colors.deepOlive.DEFAULT
export const MAP_PIN_HALO_OPACITY = 0.16
export const MAP_PIN_RING_COLOR = colors.warmWhite.DEFAULT

export const COUNTRIES_SOURCE_ID = 'countries'
export const COUNTRIES_FILL_LAYER_ID = 'countries-fill'
export const COUNTRIES_LINE_LAYER_ID = 'countries-line'

/**
 * A MapLibre `fill-color`-shaped expression: terracotta for the given
 * visited countries, the unvisited tan otherwise. Country names are matched
 * against Natural Earth's `properties.name` after alias normalization, so
 * callers can pass whatever free-text country strings trips/memories store.
 */
export function buildVisitedFillExpression(visitedCountryNames: string[]): unknown[] {
  const normalized = [...new Set(visitedCountryNames.map(normalizeCountryName))]
  if (normalized.length === 0) return ['literal', UNVISITED_LAND]
  return ['match', ['get', 'name'], normalized, VISITED_FILL, UNVISITED_LAND]
}

/** Companion `fill-opacity` expression — visited countries render fully opaque. */
export function buildVisitedOpacityExpression(visitedCountryNames: string[]): unknown[] {
  const normalized = [...new Set(visitedCountryNames.map(normalizeCountryName))]
  if (normalized.length === 0) return ['literal', UNVISITED_OPACITY]
  return ['match', ['get', 'name'], normalized, 1, UNVISITED_OPACITY]
}

/**
 * A minimal MapLibre GL style JSON: a single flat-fill country layer plus
 * borders, no basemap tiles, no roads/labels/POIs — the "Real geometry,
 * never a drawing" flat world the design calls for. The return shape matches
 * MapLibre's `StyleSpecification` (both `maplibre-gl` on web and
 * `@maplibre/maplibre-react-native` on native consume the same JSON style
 * format) without depending on either package's types directly, so this
 * package stays framework/platform-agnostic.
 */
export function buildFlatWorldStyle(visitedCountryNames: string[]) {
  return {
    version: 8 as const,
    sources: {
      [COUNTRIES_SOURCE_ID]: {
        type: 'geojson' as const,
        data: getWorldCountriesGeoJSON(),
      },
    },
    layers: [
      {
        id: 'background',
        type: 'background' as const,
        paint: { 'background-color': colors.agedCream.DEFAULT },
      },
      {
        id: COUNTRIES_FILL_LAYER_ID,
        type: 'fill' as const,
        source: COUNTRIES_SOURCE_ID,
        paint: {
          'fill-color': buildVisitedFillExpression(visitedCountryNames),
          'fill-opacity': buildVisitedOpacityExpression(visitedCountryNames),
        },
      },
      {
        id: COUNTRIES_LINE_LAYER_ID,
        type: 'line' as const,
        source: COUNTRIES_SOURCE_ID,
        paint: {
          'line-color': COUNTRY_STROKE,
          'line-width': STROKE_WIDTH,
        },
      },
    ],
  }
}
