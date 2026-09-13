import { colors } from '@passe/theme'
import { getContinentLabelsGeoJSON } from './continents'
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
export const COUNTRY_LABELS_LAYER_ID = 'countries-label'
export const CONTINENT_LABELS_SOURCE_ID = 'continent-labels'
export const CONTINENT_LABELS_LAYER_ID = 'continent-labels-layer'

// Public, key-free glyph PBF server hosted by the OpenMapTiles project —
// exists specifically so flat/custom MapLibre styles like this one (no
// vector basemap, no MapTiler/Mapbox account) can still render `text-field`
// symbol layers. MapLibre GL has no built-in text rendering without a
// `glyphs` template like this one.
const GLYPHS_URL = 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf'
const LABEL_FONT = ['Noto Sans Regular']
const LABEL_TEXT_COLOR = colors.darkEspresso.DEFAULT
const LABEL_HALO_COLOR = colors.agedCream.DEFAULT

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
 * A minimal MapLibre GL style JSON: a flat-fill country layer plus borders
 * and name labels (continent names at low zoom, country names as you zoom
 * in) — no basemap tiles, no roads/POIs, no hosted vector/raster provider.
 * The return shape matches MapLibre's `StyleSpecification` (both
 * `maplibre-gl` on web and `@maplibre/maplibre-react-native` on native
 * consume the same JSON style format) without depending on either package's
 * types directly, so this package stays framework/platform-agnostic.
 */
export function buildFlatWorldStyle(visitedCountryNames: string[]) {
  return {
    version: 8 as const,
    glyphs: GLYPHS_URL,
    sources: {
      [COUNTRIES_SOURCE_ID]: {
        type: 'geojson' as const,
        data: getWorldCountriesGeoJSON(),
      },
      [CONTINENT_LABELS_SOURCE_ID]: {
        type: 'geojson' as const,
        data: getContinentLabelsGeoJSON(),
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
      {
        id: COUNTRY_LABELS_LAYER_ID,
        type: 'symbol' as const,
        source: COUNTRIES_SOURCE_ID,
        minzoom: 2,
        layout: {
          'text-field': ['get', 'name'],
          'text-font': LABEL_FONT,
          'text-size': ['interpolate', ['linear'], ['zoom'], 2, 9, 6, 13, 10, 17],
          'text-max-width': 7,
        },
        paint: {
          'text-color': LABEL_TEXT_COLOR,
          'text-halo-color': LABEL_HALO_COLOR,
          'text-halo-width': 1.1,
          'text-opacity': ['interpolate', ['linear'], ['zoom'], 2, 0, 3, 0.85],
        },
      },
      {
        id: CONTINENT_LABELS_LAYER_ID,
        type: 'symbol' as const,
        source: CONTINENT_LABELS_SOURCE_ID,
        maxzoom: 4,
        layout: {
          'text-field': ['get', 'name'],
          'text-font': LABEL_FONT,
          'text-size': 13,
          'text-transform': 'uppercase' as const,
          'text-letter-spacing': 0.12,
        },
        paint: {
          'text-color': LABEL_TEXT_COLOR,
          'text-halo-color': LABEL_HALO_COLOR,
          'text-halo-width': 1.2,
          'text-opacity': ['interpolate', ['linear'], ['zoom'], 3, 1, 4, 0],
        },
      },
    ],
  }
}
