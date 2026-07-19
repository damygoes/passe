import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useUploadImage } from '../hooks/use-upload'
import { BASE_URL, createWrapper, mockFetchError, mockFetchSuccess } from './test-utils'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetAllMocks()
})

describe('useUploadImage', () => {
  it('signs, then invokes the platform-supplied put, then resolves the S3 key', async () => {
    mockFetchSuccess({ key: 'passe/user-1/abc.jpg', uploadUrl: 'https://s3.mock/presigned-put' })
    const put = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useUploadImage(), { wrapper: createWrapper() })

    const uploaded = await result.current.mutateAsync({ contentType: 'image/jpeg', put })

    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/uploads/sign`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ contentType: 'image/jpeg' }),
      }),
    )
    expect(put).toHaveBeenCalledWith('https://s3.mock/presigned-put')
    expect(uploaded).toEqual({ key: 'passe/user-1/abc.jpg' })
  })

  it('does not call put when signing fails', async () => {
    mockFetchError(401, 'Unauthorised')
    const put = vi.fn()
    const { result } = renderHook(() => useUploadImage(), { wrapper: createWrapper() })

    result.current.mutate({ contentType: 'image/jpeg', put })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(put).not.toHaveBeenCalled()
  })

  it('surfaces an error when the platform put rejects', async () => {
    mockFetchSuccess({ key: 'passe/user-1/abc.jpg', uploadUrl: 'https://s3.mock/presigned-put' })
    const put = vi.fn().mockRejectedValue(new Error('network dropped'))
    const { result } = renderHook(() => useUploadImage(), { wrapper: createWrapper() })

    result.current.mutate({ contentType: 'image/jpeg', put })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toEqual(new Error('network dropped'))
  })
})
