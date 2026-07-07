import { verifyWebhook } from '@clerk/nextjs/webhooks'
import type { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from './route'

vi.mock('@clerk/nextjs/webhooks', () => ({ verifyWebhook: vi.fn() }))

const mockSyncClerkUser = vi.fn()
vi.mock('@passe/auth/webhook', () => ({ syncClerkUser: (...args: unknown[]) => mockSyncClerkUser(...args) }))

const mockCancelStripeBilling = vi.fn()
vi.mock('@/lib/stripe', () => ({
  cancelStripeBilling: (...args: unknown[]) => mockCancelStripeBilling(...args),
}))

function req() {
  return new Request('http://localhost/api/webhooks/clerk', { method: 'POST' }) as NextRequest
}

beforeEach(() => {
  vi.clearAllMocks()
  mockSyncClerkUser.mockResolvedValue(undefined)
  mockCancelStripeBilling.mockResolvedValue(undefined)
})

describe('POST /api/webhooks/clerk', () => {
  it('returns 400 when webhook verification fails', async () => {
    vi.mocked(verifyWebhook).mockRejectedValue(new Error('bad signature'))
    const res = await POST(req())
    expect(res.status).toBe(400)
  })

  it('syncs the user and returns 200 for user.created', async () => {
    vi.mocked(verifyWebhook).mockResolvedValue({
      type: 'user.created',
      data: { id: 'user_1' },
    } as never)

    const res = await POST(req())
    expect(res.status).toBe(200)
    expect(mockSyncClerkUser).toHaveBeenCalled()
  })

  it('cancels Stripe billing before syncing a user.deleted event', async () => {
    vi.mocked(verifyWebhook).mockResolvedValue({
      type: 'user.deleted',
      data: { id: 'user_1' },
    } as never)

    const res = await POST(req())
    expect(res.status).toBe(200)
    expect(mockCancelStripeBilling).toHaveBeenCalledWith('user_1')
    expect(mockSyncClerkUser).toHaveBeenCalled()
  })

  it('ignores event types it does not handle', async () => {
    vi.mocked(verifyWebhook).mockResolvedValue({ type: 'session.created', data: {} } as never)
    const res = await POST(req())
    expect(res.status).toBe(200)
    expect(mockSyncClerkUser).not.toHaveBeenCalled()
  })

  it('returns 500 when syncing throws', async () => {
    vi.mocked(verifyWebhook).mockResolvedValue({
      type: 'user.updated',
      data: { id: 'user_1' },
    } as never)
    mockSyncClerkUser.mockRejectedValue(new Error('db down'))

    const res = await POST(req())
    expect(res.status).toBe(500)
  })
})
