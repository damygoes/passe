import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from './route'

const mockConstructEvent = vi.fn()
vi.mock('@/lib/stripe', () => ({
  getStripe: () => ({ webhooks: { constructEvent: mockConstructEvent } }),
  priceIdToPlan: (priceId: string) => (priceId === 'price_explorer' ? 'explorer' : null),
}))

const mockDb = vi.hoisted(() => ({
  query: { users: { findFirst: vi.fn() } },
  update: vi.fn(),
}))

vi.mock('@passe/db', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@passe/db')>()
  return { ...actual, db: mockDb }
})

import { dbChain } from '@/test/db-mock'

function req(signature: string | null) {
  const headers = new Headers()
  if (signature) headers.set('stripe-signature', signature)
  return new Request('http://localhost/api/webhooks/stripe', {
    method: 'POST',
    headers,
    body: 'raw-body',
  })
}

function subscriptionEvent(type: string, overrides: Record<string, unknown> = {}) {
  return {
    type,
    data: {
      object: {
        status: 'active',
        customer: 'cus_1',
        items: { data: [{ price: { id: 'price_explorer' } }] },
        ...overrides,
      },
    },
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('STRIPE_WEBHOOK_SECRET', 'whsec_test')
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('POST /api/webhooks/stripe', () => {
  it('returns 400 when the signature header is missing', async () => {
    const res = await POST(req(null))
    expect(res.status).toBe(400)
  })

  it('returns 400 when signature verification throws', async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error('bad signature')
    })
    const res = await POST(req('sig'))
    expect(res.status).toBe(400)
  })

  it('acknowledges but ignores event types it does not handle', async () => {
    mockConstructEvent.mockReturnValue({ type: 'payment_intent.succeeded' })
    const res = await POST(req('sig'))
    expect(res.status).toBe(200)
    expect(mockDb.update).not.toHaveBeenCalled()
  })

  it('acknowledges when no user matches the Stripe customer', async () => {
    mockConstructEvent.mockReturnValue(subscriptionEvent('customer.subscription.created'))
    mockDb.query.users.findFirst.mockResolvedValue(undefined)
    const res = await POST(req('sig'))
    expect(res.status).toBe(200)
    expect(mockDb.update).not.toHaveBeenCalled()
  })

  it('updates the plan when a subscription becomes active', async () => {
    mockConstructEvent.mockReturnValue(subscriptionEvent('customer.subscription.created'))
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'free' })
    const mockWhere = vi.fn()
    mockDb.update.mockReturnValue({ set: vi.fn(() => ({ where: mockWhere })) } as never)

    const res = await POST(req('sig'))
    expect(res.status).toBe(200)
    expect(mockDb.update).toHaveBeenCalled()
  })

  it('does not write when the plan is unchanged', async () => {
    mockConstructEvent.mockReturnValue(subscriptionEvent('customer.subscription.updated'))
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'explorer' })

    const res = await POST(req('sig'))
    expect(res.status).toBe(200)
    expect(mockDb.update).not.toHaveBeenCalled()
  })

  it('downgrades to free on subscription deletion', async () => {
    mockConstructEvent.mockReturnValue(subscriptionEvent('customer.subscription.deleted'))
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'explorer' })
    const mockSet = vi.fn(() => dbChain(undefined))
    mockDb.update.mockReturnValue({ set: mockSet } as never)

    const res = await POST(req('sig'))
    expect(res.status).toBe(200)
    expect(mockSet).toHaveBeenCalledWith({ plan: 'free' })
  })

  it('returns 500 when the DB write throws', async () => {
    mockConstructEvent.mockReturnValue(subscriptionEvent('customer.subscription.created'))
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'free' })
    mockDb.update.mockImplementation(() => {
      throw new Error('db down')
    })

    const res = await POST(req('sig'))
    expect(res.status).toBe(500)
  })
})
