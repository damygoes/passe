import { db } from '@passe/db/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cancelStripeBilling, getOrCreateStripeCustomer, planToPriceId, priceIdToPlan } from './stripe'

vi.mock('@passe/db/client', () => ({
  db: {
    query: { users: { findFirst: vi.fn() } },
    update: vi.fn(),
  },
}))

const mockCustomersCreate = vi.fn()
const mockCustomersDel = vi.fn()
vi.mock('stripe', () => ({
  default: vi.fn().mockImplementation(function StripeMock() {
    return { customers: { create: mockCustomersCreate, del: mockCustomersDel } }
  }),
}))

beforeEach(() => {
  vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_mock')
  vi.stubEnv('STRIPE_PRICE_EXPLORER', 'price_explorer')
  vi.stubEnv('STRIPE_PRICE_COLLECTOR', 'price_collector')
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.clearAllMocks()
})

describe('planToPriceId', () => {
  it('resolves the configured price id for a plan', () => {
    expect(planToPriceId('explorer')).toBe('price_explorer')
    expect(planToPriceId('collector')).toBe('price_collector')
  })

  it('throws when the price id env var is not set', () => {
    vi.stubEnv('STRIPE_PRICE_EXPLORER', '')
    expect(() => planToPriceId('explorer')).toThrow(/not set/)
  })
})

describe('priceIdToPlan', () => {
  it('maps a known price id back to its plan', () => {
    expect(priceIdToPlan('price_explorer')).toBe('explorer')
    expect(priceIdToPlan('price_collector')).toBe('collector')
  })

  it('returns null for an unknown price id', () => {
    expect(priceIdToPlan('price_unknown')).toBeNull()
  })
})

describe('getOrCreateStripeCustomer', () => {
  it('throws when the user does not exist', async () => {
    vi.mocked(db.query.users.findFirst).mockResolvedValue(undefined)
    await expect(getOrCreateStripeCustomer('user_1')).rejects.toThrow(/not found/)
  })

  it('returns the existing Stripe customer id without calling Stripe', async () => {
    vi.mocked(db.query.users.findFirst).mockResolvedValue({
      id: 'user_1',
      stripeCustomerId: 'cus_existing',
    } as never)

    const result = await getOrCreateStripeCustomer('user_1')

    expect(result).toBe('cus_existing')
    expect(mockCustomersCreate).not.toHaveBeenCalled()
  })

  it('creates a Stripe customer and persists it when none exists yet', async () => {
    vi.mocked(db.query.users.findFirst).mockResolvedValue({
      id: 'user_1',
      email: 'user@example.com',
      stripeCustomerId: null,
    } as never)
    mockCustomersCreate.mockResolvedValue({ id: 'cus_new' })
    const mockWhere = vi.fn()
    const mockSet = vi.fn(() => ({ where: mockWhere }))
    vi.mocked(db.update).mockReturnValue({ set: mockSet } as never)

    const result = await getOrCreateStripeCustomer('user_1')

    expect(mockCustomersCreate).toHaveBeenCalledWith({
      email: 'user@example.com',
      metadata: { userId: 'user_1' },
    })
    expect(mockSet).toHaveBeenCalledWith({ stripeCustomerId: 'cus_new' })
    expect(result).toBe('cus_new')
  })
})

describe('cancelStripeBilling', () => {
  it('does nothing when the user has no Stripe customer id', async () => {
    vi.mocked(db.query.users.findFirst).mockResolvedValue({
      id: 'user_1',
      stripeCustomerId: null,
    } as never)

    await cancelStripeBilling('user_1')

    expect(mockCustomersDel).not.toHaveBeenCalled()
  })

  it('deletes the Stripe customer when one exists', async () => {
    vi.mocked(db.query.users.findFirst).mockResolvedValue({
      id: 'user_1',
      stripeCustomerId: 'cus_1',
    } as never)

    await cancelStripeBilling('user_1')

    expect(mockCustomersDel).toHaveBeenCalledWith('cus_1')
  })

  it('swallows errors from Stripe so callers are never blocked', async () => {
    vi.mocked(db.query.users.findFirst).mockResolvedValue({
      id: 'user_1',
      stripeCustomerId: 'cus_1',
    } as never)
    mockCustomersDel.mockRejectedValueOnce(new Error('stripe down'))

    await expect(cancelStripeBilling('user_1')).resolves.toBeUndefined()
  })
})
