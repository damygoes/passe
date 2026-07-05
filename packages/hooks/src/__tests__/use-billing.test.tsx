import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCreateCheckoutSession, useCreatePortalSession } from '../hooks/use-billing'
import { BASE_URL, createWrapper, mockFetchSuccess } from './test-utils'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetAllMocks()
})

describe('useCreateCheckoutSession', () => {
  it('sends POST /api/billing/checkout with the plan', async () => {
    mockFetchSuccess({ url: 'https://checkout.stripe.com/session-1' })
    const { result } = renderHook(() => useCreateCheckoutSession(), { wrapper: createWrapper() })

    await result.current.mutateAsync('explorer')

    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/billing/checkout`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ plan: 'explorer' }),
      }),
    )
  })

  it('returns the Stripe checkout URL', async () => {
    mockFetchSuccess({ url: 'https://checkout.stripe.com/session-1' })
    const { result } = renderHook(() => useCreateCheckoutSession(), { wrapper: createWrapper() })

    const data = await result.current.mutateAsync('collector')

    expect(data).toEqual({ url: 'https://checkout.stripe.com/session-1' })
  })
})

describe('useCreatePortalSession', () => {
  it('sends POST /api/billing/portal and returns the portal URL', async () => {
    mockFetchSuccess({ url: 'https://billing.stripe.com/portal-1' })
    const { result } = renderHook(() => useCreatePortalSession(), { wrapper: createWrapper() })

    const data = await result.current.mutateAsync()

    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/billing/portal`,
      expect.objectContaining({ method: 'POST' }),
    )
    expect(data).toEqual({ url: 'https://billing.stripe.com/portal-1' })
  })
})
