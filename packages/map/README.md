# @passe/map

Framework-agnostic world-map data and styling shared by `apps/web`'s and
`apps/mobile`'s MapLibre GL `WorldMap` components — the flat, illustrated
"Your world" map (visited countries filled, city pins), not a hosted street
basemap.

## What's here

- `src/data/countries-110m.geo.json` — Natural Earth 110m country polygons
  (public domain), as plain GeoJSON.
- `countries.ts` — `normalizeCountryName()`, mapping common free-text country
  spellings (`"USA"`, `"Czech Republic"`, …) onto the exact Natural Earth name
  so choropleth matching works against real trip/memory data.
- `geo.ts` — `getWorldCountriesGeoJSON()`, the typed accessor for the bundled data.
- `style.ts` — `buildFlatWorldStyle(visitedCountryNames)`, a minimal MapLibre
  GL style JSON (one fill layer + one line layer, no basemap tiles) that both
  platforms' MapLibre instances can consume directly as `mapStyle`/`styleJSON`.

## Why a bundled static GeoJSON, not `world-atlas` + `topojson-client` at runtime

The design's own prototype (`worldmap.js`) fetches `world-atlas`'s TopoJSON
and converts it with `topojson-client` in the browser. Shipping those as
runtime dependencies here would mean decoding topology on every app boot and
adding a real dependency to the mobile bundle for a one-time conversion. This
package bundles the already-converted GeoJSON instead — dependency-free,
identical on web and native, no runtime conversion cost.

To regenerate `src/data/countries-110m.geo.json` (e.g. if world-atlas ships a
new version):

```bash
curl -sL -o /tmp/countries-110m.json \
  "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json"

# in a scratch dir, so topojson-client isn't added as a repo dependency:
npm install topojson-client@3.1.0 --no-save
node -e "
  const topojson = require('topojson-client')
  const topo = require('/tmp/countries-110m.json')
  const geo = topojson.feature(topo, topo.objects.countries)
  require('fs').writeFileSync('countries-110m.geo.json', JSON.stringify(geo))
"
```

Then copy the result into `src/data/` and re-check `countries.ts`'s alias
table against the (usually unchanged) list of `properties.name` values.
