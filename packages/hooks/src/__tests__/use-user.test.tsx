import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useUser, useUpdateUser } from '../hooks/use-user'
import { BASE_URL, createWrapper, mockFetchSuccess } from './test-utils'

const mockUser = { id: 'user-1', username: 'traveller', displayName: 'Traveller' }

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetAllMocks()
})

describe('useUser', () => {
  it('fetches GET /api/user and returns the user data', async () => {
    mockFetchSuccess(mockUser)
    const { result } = renderHook(() => useUser(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockUser)
    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/user`,
      expect.objectContaining({ method: 'GET' }),
    )
  })

  it('uses the Authorization header', async () => {
    mockFetchSuccess(mockUser)
    renderHook(() => useUser(), { wrapper: createWrapper() })

    await waitFor(() => expect(vi.mocked(fetch)).toHaveBeenCalled())

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
      }),
    )
  })

  it('exposes isLoading while the request is in flight', () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useUser(), { wrapper: createWrapper() })
    expect(result.current.isLoading).toBe(true)
  })

  it('exposes isError when the request fails', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async () => ({ error: 'Unauthorized' }),
    } as Response)

    const { result } = renderHook(() => useUser(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe('useUpdateUser', () => {
  it('sends PATCH /api/user with the payload', async () => {
    mockFetchSuccess(mockUser)
    const { result } = renderHook(() => useUpdateUser(), { wrapper: createWrapper() })

    await result.current.mutateAsync({ username: 'updated' })

    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/user`,
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ username: 'updated' }),
      }),
    )
  })

  it('returns the updated user data from the mutation', async () => {
    const updated = { ...mockUser, username: 'new-name' }
    mockFetchSuccess(updated)
    const { result } = renderHook(() => useUpdateUser(), { wrapper: createWrapper() })

    const data = await result.current.mutateAsync({ username: 'new-name' })

    expect(data).toEqual(updated)
  })
})
