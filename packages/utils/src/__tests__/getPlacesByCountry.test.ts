import { describe, expect, it } from 'vitest'
import { getPlacesByCountry } from '../getPlacesByCountry'

describe('getPlacesByCountry', () => {
  it('counts distinct cities per country, sorted descending', () => {
    const memories = [
      { city: 'Marrakesh', country: 'Morocco' },
      { city: 'Fès', country: 'Morocco' },
      { city: 'Chefchaouen', country: 'Morocco' },
      { city: 'Tokyo', country: 'Japan' },
      { city: 'Kyoto', country: 'Japan' },
    ]
    expect(getPlacesByCountry({ memories })).toEqual([
      { country: 'Morocco', cityCount: 3 },
      { country: 'Japan', cityCount: 2 },
    ])
  })

  it('dedupes repeated cities within the same country', () => {
    const memories = [
      { city: 'Marrakesh', country: 'Morocco' },
      { city: 'Marrakesh', country: 'Morocco' },
    ]
    expect(getPlacesByCountry({ memories })).toEqual([{ country: 'Morocco', cityCount: 1 }])
  })

  it('skips memories with no country', () => {
    const memories = [{ city: 'Somewhere', country: null }]
    expect(getPlacesByCountry({ memories })).toEqual([])
  })

  it('drops a country with no named cities', () => {
    const memories = [{ city: null, country: 'Morocco' }]
    expect(getPlacesByCountry({ memories })).toEqual([])
  })

  it('returns an empty array for no memories', () => {
    expect(getPlacesByCountry({ memories: [] })).toEqual([])
  })
})
