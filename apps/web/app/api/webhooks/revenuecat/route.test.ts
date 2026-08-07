import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from './route'

const mockDb = vi.hoisted(() => ({
  query: { users: { findFirst: vi.fn() } },
  update: vi.fn(),
}))

vi.mock('@passe/db', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@passe/db')>()
  return { ...actual, db: mockDb }
})

import { dbChain } from '@/test/db-mock'

function req(body: unknown, authHeader: string | null = 'Bearer whsec_test') {
  const headers = new Headers()
  if (authHeader) headers.set('authorization', authHeader)
  return new Request('http://localhost/api/webhooks/revenuecat', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
}

function revenueCatEvent(type: string, overrides: Record<string, unknown> = {}) {
  return {
    event: {
      type,
      app_user_id: 'user-1',
      entitlement_ids: ['explorer'],
      environment: 'PRODUCTION',
      ...overrides,
    },
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('REVENUECAT_WEBHOOK_SECRET', 'whsec_test')
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('POST /api/webhooks/revenuecat', () => {
  it('returns 401 when the authorization header is missing', async () => {
    const res = await POST(req(revenueCatEvent('INITIAL_PURCHASE'), null))
    expect(res.status).toBe(401)
  })

  it('returns 401 when the authorization header does not match the secret', async () => {
    const res = await POST(req(revenueCatEvent('INITIAL_PURCHASE'), 'Bearer wrong'))
    expect(res.status).toBe(401)
  })

  it('returns 401 when REVENUECAT_WEBHOOK_SECRET is not set', async () => {
    vi.stubEnv('REVENUECAT_WEBHOOK_SECRET', '')
    const res = await POST(req(revenueCatEvent('INITIAL_PURCHASE')))
    expect(res.status).toBe(401)
  })

  it('acknowledges but ignores event types it does not handle', async () => {
    const res = await POST(req(revenueCatEvent('CANCELLATION')))
    expect(res.status).toBe(200)
    expect(mockDb.update).not.toHaveBeenCalled()
  })

  it('acknowledges when no user matches the app_user_id', async () => {
    mockDb.query.users.findFirst.mockResolvedValue(undefined)
    const res = await POST(req(revenueCatEvent('INITIAL_PURCHASE')))
    expect(res.status).toBe(200)
    expect(mockDb.update).not.toHaveBeenCalled()
  })

  it('updates plan and planSource on initial purchase', async () => {
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'free', planSource: null })
    const mockSet = vi.fn(() => dbChain(undefined))
    mockDb.update.mockReturnValue({ set: mockSet } as never)

    const res = await POST(req(revenueCatEvent('INITIAL_PURCHASE')))
    expect(res.status).toBe(200)
    expect(mockSet).toHaveBeenCalledWith({ plan: 'explorer', planSource: 'revenuecat' })
  })

  it('prioritizes collector over explorer when both entitlements are present', async () => {
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'free', planSource: null })
    const mockSet = vi.fn(() => dbChain(undefined))
    mockDb.update.mockReturnValue({ set: mockSet } as never)

    const res = await POST(
      req(revenueCatEvent('RENEWAL', { entitlement_ids: ['explorer', 'collector'] })),
    )
    expect(res.status).toBe(200)
    expect(mockSet).toHaveBeenCalledWith({ plan: 'collector', planSource: 'revenuecat' })
  })

  it('does not write when plan and planSource are unchanged', async () => {
    mockDb.query.users.findFirst.mockResolvedValue({
      id: 'user-1',
      plan: 'explorer',
      planSource: 'revenuecat',
    })

    const res = await POST(req(revenueCatEvent('RENEWAL')))
    expect(res.status).toBe(200)
    expect(mockDb.update).not.toHaveBeenCalled()
  })

  it('does not downgrade on CANCELLATION alone', async () => {
    mockDb.query.users.findFirst.mockResolvedValue({
      id: 'user-1',
      plan: 'explorer',
      planSource: 'revenuecat',
    })

    const res = await POST(req(revenueCatEvent('CANCELLATION')))
    expect(res.status).toBe(200)
    expect(mockDb.update).not.toHaveBeenCalled()
  })

  it('downgrades to free and clears planSource on EXPIRATION', async () => {
    mockDb.query.users.findFirst.mockResolvedValue({
      id: 'user-1',
      plan: 'explorer',
      planSource: 'revenuecat',
    })
    const mockSet = vi.fn(() => dbChain(undefined))
    mockDb.update.mockReturnValue({ set: mockSet } as never)

    const res = await POST(req(revenueCatEvent('EXPIRATION')))
    expect(res.status).toBe(200)
    expect(mockSet).toHaveBeenCalledWith({ plan: 'free', planSource: null })
  })

  it('acknowledges a grant event with no recognized entitlement', async () => {
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'free', planSource: null })

    const res = await POST(req(revenueCatEvent('INITIAL_PURCHASE', { entitlement_ids: [] })))
    expect(res.status).toBe(200)
    expect(mockDb.update).not.toHaveBeenCalled()
  })

  it('returns 500 when the DB write throws', async () => {
    mockDb.query.users.findFirst.mockResolvedValue({ id: 'user-1', plan: 'free', planSource: null })
    mockDb.update.mockImplementation(() => {
      throw new Error('db down')
    })

    const res = await POST(req(revenueCatEvent('INITIAL_PURCHASE')))
    expect(res.status).toBe(500)
  })
})
