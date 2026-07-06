import { describe, expect, it } from 'vitest'
import {
  memoryEditRoute,
  publicPortfolioRoute,
  publicTripRoute,
  routes,
  tripEditRoute,
  tripNewMemoryRoute,
  tripRoute,
} from './routes'

describe('routes', () => {
  it('exposes the expected static route map', () => {
    expect(routes.dashboard).toBe('/dashboard')
    expect(routes.signIn).toBe('/sign-in')
    expect(routes.billing).toBe('/billing')
  })
})

describe('route builders', () => {
  it('builds trip-scoped routes from an id', () => {
    expect(tripRoute('t1')).toBe('/trips/t1')
    expect(tripEditRoute('t1')).toBe('/trips/t1/edit')
    expect(tripNewMemoryRoute('t1')).toBe('/trips/t1/memories/new')
  })

  it('builds a memory edit route from trip + memory ids', () => {
    expect(memoryEditRoute('t1', 'm1')).toBe('/trips/t1/memories/m1/edit')
  })

  it('builds public portfolio and trip routes from a username', () => {
    expect(publicPortfolioRoute('alice')).toBe('/u/alice')
    expect(publicTripRoute('alice', 't1')).toBe('/u/alice/trips/t1')
  })
})
