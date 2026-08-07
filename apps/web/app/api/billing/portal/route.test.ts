import { auth } from '@clerk/nextjs/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from './route'

vi.mock('@clerk/nextjs/server', () => ({ auth: vi.fn() }))

const mockSessionsCreate = vi.fn()
vi.mock('@/lib/billing/stripe', () => ({
  getStripe: () => ({ billingPortal: { sessions: { create: mockSessionsCreate } } }),
}))

const mockDb = vi.hoisted(() => ({
  query: { users: { findFirst: vi.fn() } },
}))

vi.mock('@passe/db', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@passe/db')>()
  return { ...actual, db: mockDb }
})

function req() {
  return new Request('http://localhost/api/billing/portal', { method: 'POST' })
}

beforeEach(() => {
  vi.mocked(auth).mockResolvedValue({ userId: 'user-1' } as Awaited<ReturnType<typeof auth>>)
})

describe('POST /api/billing/portal', () => {
  it('returns 401 when unauthenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>)
    const res = await POST(req())
    expect(res.status).toBe(401)
  })

  it('returns 404 when the user does not exist', async () => {
    mockDb.query.users.findFirst.mockResolvedValue(undefined)
    const res = await POST(req())
    expect(res.status).toBe(404)
  })

  it('returns 400 when the user has no Stripe customer yet', async () => {
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', stripeCustomerId: null })
    const res = await POST(req())
    expect(res.status).toBe(400)
  })

  it('returns 409 when the subscription is managed through RevenueCat', async () => {
    mockDb.query.users.findFirst.mockResolvedValue({
      id: 'user-1',
      stripeCustomerId: null,
      planSource: 'revenuecat',
    })
    const res = await POST(req())
    expect(res.status).toBe(409)
  })

  it('returns the portal URL on success', async () => {
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', stripeCustomerId: 'cus_1' })
    mockSessionsCreate.mockResolvedValue({ url: 'https://billing.stripe.com/session' })

    const res = await POST(req())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.url).toBe('https://billing.stripe.com/session')
  })

  it('returns 500 when Stripe throws', async () => {
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', stripeCustomerId: 'cus_1' })
    mockSessionsCreate.mockRejectedValue(new Error('stripe down'))

    const res = await POST(req())
    expect(res.status).toBe(500)
  })
})
