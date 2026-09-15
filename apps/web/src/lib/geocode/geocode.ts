import { createLogger } from '@passe/logger'

const log = createLogger({ context: { module: 'lib/geocode' } })

// Nominatim's usage policy requires an identifying User-Agent on every request.
const NOMINATIM_USER_AGENT = 'Passe/1.0 (https://passe.cc)'

interface GeocodeResult {
  lat: number
  lng: number
}

interface NominatimSearchResult {
  lat: string
  lon: string
}

interface NominatimReverseResult {
  display_name?: string
  address?: {
    city?: string
    town?: string
    village?: string
    municipality?: string
    country?: string
  }
}

// Forward geocode — converts free-text city/country into coordinates. Used as
// a fallback whenever a memory is saved without a precise GPS location.
export async function geocodeCityCountry(
  city?: string | null,
  country?: string | null,
): Promise<GeocodeResult | null> {
  const query = [city, country].filter(Boolean).join(', ')
  if (!query) return null

  try {
    const url = new URL('https://nominatim.openstreetmap.org/search')
    url.searchParams.set('q', query)
    url.searchParams.set('format', 'jsonv2')
    url.searchParams.set('limit', '1')
    url.searchParams.set('accept-language', 'en')

    const res = await fetch(url, { headers: { 'User-Agent': NOMINATIM_USER_AGENT } })
    if (!res.ok) {
      log.error('Nominatim forward geocode failed', { status: res.status, query })
      return null
    }

    const results = (await res.json()) as NominatimSearchResult[]
    const [first] = results
    if (!first) return null

    return { lat: Number(first.lat), lng: Number(first.lon) }
  } catch (err) {
    log.error('Nominatim forward geocode threw', {
      query,
      error: err instanceof Error ? err.message : String(err),
    })
    return null
  }
}

// Reverse geocode — converts GPS coordinates into a city/country pair (and a
// full-address placeName pre-fill) so the "Use current location" button can
// auto-fill those fields. placeName is only ever a suggested starting value —
// callers must leave it user-editable, never silently overwrite an edit.
export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<{ city: string | null; country: string | null; placeName: string | null }> {
  try {
    const url = new URL('https://nominatim.openstreetmap.org/reverse')
    url.searchParams.set('lat', String(lat))
    url.searchParams.set('lon', String(lng))
    url.searchParams.set('format', 'jsonv2')
    url.searchParams.set('zoom', '10')
    url.searchParams.set('addressdetails', '1')
    url.searchParams.set('accept-language', 'en')

    const res = await fetch(url, { headers: { 'User-Agent': NOMINATIM_USER_AGENT } })
    if (!res.ok) {
      log.error('Nominatim reverse geocode failed', { status: res.status, lat, lng })
      return { city: null, country: null, placeName: null }
    }

    const result = (await res.json()) as NominatimReverseResult
    const address = result.address ?? {}
    const city = address.city ?? address.town ?? address.village ?? address.municipality ?? null
    const country = address.country ?? null
    const placeName = result.display_name ?? null
    return { city, country, placeName }
  } catch (err) {
    log.error('Nominatim reverse geocode threw', {
      lat,
      lng,
      error: err instanceof Error ? err.message : String(err),
    })
    return { city: null, country: null, placeName: null }
  }
}
