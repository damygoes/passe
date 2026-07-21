import { auth } from '@clerk/nextjs/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from './route'

vi.mock('@clerk/nextjs/server', () => ({ auth: vi.fn() }))

const mockGetOrCreateStripeCustomer = vi.fn()
const mockSessionsCreate = vi.fn()
vi.mock('@/lib/billing/stripe', () => ({
  getOrCreateStripeCustomer: (...args: unknown[]) => mockGetOrCreateStripeCustomer(...args),
  getStripe: () => ({ checkout: { sessions: { create: mockSessionsCreate } } }),
  planToPriceId: (plan: string) => `price_${plan}`,
}))

const mockDb = vi.hoisted(() => ({
  query: { users: { findFirst: vi.fn() } },
}))

vi.mock('@passe/db', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@passe/db')>()
  return { ...actual, db: mockDb }
})

function req(body: unknown) {
  return new Request('http://localhost/api/billing/checkout', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  vi.mocked(auth).mockResolvedValue({ userId: 'user-1' } as Awaited<ReturnType<typeof auth>>)
})

describe('POST /api/billing/checkout', () => {
  it('returns 401 when unauthenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>)
    const res = await POST(req({ plan: 'explorer' }))
    expect(res.status).toBe(401)
  })

  it('returns 400 on an invalid plan', async () => {
    const res = await POST(req({ plan: 'free' }))
    expect(res.status).toBe(400)
  })

  it('returns 404 when the user does not exist', async () => {
    mockDb.query.users.findFirst.mockResolvedValue(undefined)
    const res = await POST(req({ plan: 'explorer' }))
    expect(res.status).toBe(404)
  })

  it('returns 409 when the user is already on a paid plan', async () => {
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'explorer' })
    const res = await POST(req({ plan: 'collector' }))
    expect(res.status).toBe(409)
  })

  it('returns the checkout URL on success', async () => {
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'free' })
    mockGetOrCreateStripeCustomer.mockResolvedValue('cus_1')
    mockSessionsCreate.mockResolvedValue({ url: 'https://checkout.stripe.com/session' })

    const res = await POST(req({ plan: 'explorer' }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.url).toBe('https://checkout.stripe.com/session')
  })

  it('returns 500 when Stripe throws', async () => {
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'free' })
    mockGetOrCreateStripeCustomer.mockRejectedValue(new Error('stripe down'))

    const res = await POST(req({ plan: 'explorer' }))
    expect(res.status).toBe(500)
  })
})
