import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'
import countriesGeoJson from './data/countries-110m.geo.json'

export interface CountryProperties {
  name: string
}

export type CountryFeature = Feature<Polygon | MultiPolygon, CountryProperties>
export type CountriesFeatureCollection = FeatureCollection<
  Polygon | MultiPolygon,
  CountryProperties
>

// Natural Earth 110m country polygons (public domain), pre-converted from
// world-atlas@2.0.2's countries-110m.json TopoJSON to plain GeoJSON at build
// time — see the package README for the conversion script. Bundling a static
// GeoJSON asset (instead of shipping topojson-client + world-atlas as runtime
// deps) keeps this dependency-free and identical on web and native: no
// topology-decode step at app boot, no extra bundle weight on mobile.
export function getWorldCountriesGeoJSON(): CountriesFeatureCollection {
  return countriesGeoJson as CountriesFeatureCollection
}
