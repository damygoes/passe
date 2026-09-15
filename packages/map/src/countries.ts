import { getWorldCountriesGeoJSON } from './geo'

// The choropleth fills polygons from Natural Earth's own `properties.name`
// values (baked into data/countries-110m.geo.json), but trips/memories store
// whatever free-text country name the user typed or a geocoder returned —
// which frequently isn't Natural Earth's exact spelling or casing. This table
// maps the common real-world variants onto the exact Natural Earth name so a
// trip tagged "USA" still lights up "United States of America" on the map.
//
// Natural Earth's 110m resolution also simply omits several small countries
// (Vatican City, Monaco, Singapore, Malta, Andorra, San Marino, Liechtenstein,
// Luxembourg's neighbors at this zoom, most Caribbean/Pacific micro-states) —
// that's an inherent limit of the 110m dataset the design explicitly calls
// for, not something an alias can fix.
const COUNTRY_NAME_ALIASES: Record<string, string> = {
  usa: 'United States of America',
  us: 'United States of America',
  'united states': 'United States of America',
  uk: 'United Kingdom',
  'great britain': 'United Kingdom',
  britain: 'United Kingdom',
  'czech republic': 'Czechia',
  'ivory coast': "Côte d'Ivoire",
  "cote d'ivoire": "Côte d'Ivoire",
  bosnia: 'Bosnia and Herz.',
  'bosnia and herzegovina': 'Bosnia and Herz.',
  'democratic republic of the congo': 'Dem. Rep. Congo',
  'dr congo': 'Dem. Rep. Congo',
  'congo-kinshasa': 'Dem. Rep. Congo',
  'republic of the congo': 'Congo',
  'congo-brazzaville': 'Congo',
  'north macedonia': 'Macedonia',
  eswatini: 'eSwatini',
  swaziland: 'eSwatini',
  burma: 'Myanmar',
  'russian federation': 'Russia',
  'central african republic': 'Central African Rep.',
  'dominican republic': 'Dominican Rep.',
  'equatorial guinea': 'Eq. Guinea',
  'south sudan': 'S. Sudan',
  uae: 'United Arab Emirates',
  'south korea': 'South Korea',
  'korea, south': 'South Korea',
  'republic of korea': 'South Korea',
  'north korea': 'North Korea',
  'korea, north': 'North Korea',
  'western sahara': 'W. Sahara',
  'timor leste': 'Timor-Leste',
  'east timor': 'Timor-Leste',
  taiwan: 'Taiwan',
}

// Case-insensitive lookup of every name Natural Earth actually uses, built
// once from the bundled data — so "morocco"/"MOROCCO"/"Morocco" all resolve
// to the exact "Morocco" the choropleth's match expression needs, not just
// the handful of names in the alias table above.
let canonicalNamesByLowercase: Map<string, string> | null = null

function getCanonicalNamesByLowercase(): Map<string, string> {
  if (canonicalNamesByLowercase) return canonicalNamesByLowercase
  canonicalNamesByLowercase = new Map(
    getWorldCountriesGeoJSON().features.map((feature) => [
      feature.properties.name.toLowerCase(),
      feature.properties.name,
    ]),
  )
  return canonicalNamesByLowercase
}

/**
 * Resolves a free-text country name (as stored on trips/memories) to the
 * exact Natural Earth `properties.name` used by the bundled GeoJSON, so it
 * can be matched against the choropleth's polygon set — checking the alias
 * table first, then a case-insensitive match against the real name list.
 * Falls through unchanged only for names with no known alias or match at
 * all (e.g. a country Natural Earth's 110m resolution omits, or a typo).
 */
export function normalizeCountryName(name: string): string {
  const trimmed = name.trim()
  const lower = trimmed.toLowerCase()
  return COUNTRY_NAME_ALIASES[lower] ?? getCanonicalNamesByLowercase().get(lower) ?? trimmed
}
