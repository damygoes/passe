import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { geocodeCityCountry, reverseGeocode } from './geocode'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function mockFetchOk(data: unknown) {
  vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: async () => data } as Response)
}

describe('geocodeCityCountry', () => {
  it('returns null when both city and country are missing', async () => {
    const result = await geocodeCityCountry(null, null)
    expect(result).toBeNull()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('returns coordinates from the first search result', async () => {
    mockFetchOk([{ lat: '48.8', lon: '2.3' }])
    const result = await geocodeCityCountry('Paris', 'France')
    expect(result).toEqual({ lat: 48.8, lng: 2.3 })
  })

  it('returns null when Nominatim finds no results', async () => {
    mockFetchOk([])
    const result = await geocodeCityCountry('Nowhere', null)
    expect(result).toBeNull()
  })

  it('returns null when the request fails', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 500 } as Response)
    const result = await geocodeCityCountry('Paris', 'France')
    expect(result).toBeNull()
  })

  it('returns null when fetch throws', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('network down'))
    const result = await geocodeCityCountry('Paris', 'France')
    expect(result).toBeNull()
  })
})

describe('reverseGeocode', () => {
  it('extracts city/country from the address, falling back through town/village/municipality', async () => {
    mockFetchOk({ address: { town: 'Kyoto', country: 'Japan' } })
    const result = await reverseGeocode(35.0, 135.7)
    expect(result).toEqual({ city: 'Kyoto', country: 'Japan' })
  })

  it('returns nulls when the address is missing', async () => {
    mockFetchOk({})
    const result = await reverseGeocode(0, 0)
    expect(result).toEqual({ city: null, country: null })
  })

  it('returns nulls when the request fails', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 503 } as Response)
    const result = await reverseGeocode(0, 0)
    expect(result).toEqual({ city: null, country: null })
  })
})
