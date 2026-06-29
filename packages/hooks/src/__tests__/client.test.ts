import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchApi } from '../client'

const BASE_URL = 'http://localhost'
const getToken = vi.fn<() => Promise<string | null>>()

function mockSuccess(data: unknown) {
  vi.mocked(fetch).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data }),
  } as Response)
}

function mockError(status: number, error: string) {
  vi.mocked(fetch).mockResolvedValueOnce({
    ok: false,
    status,
    statusText: error,
    json: async () => ({ error }),
  } as Response)
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
  getToken.mockResolvedValue('test-token')
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetAllMocks()
})

describe('fetchApi', () => {
  it('returns the data field from a successful JSON response', async () => {
    mockSuccess({ id: '1', name: 'Tokyo' })
    const result = await fetchApi('/trips', {}, getToken, BASE_URL)
    expect(result).toEqual({ id: '1', name: 'Tokyo' })
  })

  it('prepends baseUrl to the path', async () => {
    mockSuccess(null)
    await fetchApi('/api/user', {}, getToken, BASE_URL)
    const [url] = vi.mocked(fetch).mock.calls[0]!
    expect(url).toBe('http://localhost/api/user')
  })

  it('defaults method to GET', async () => {
    mockSuccess(null)
    await fetchApi('/path', {}, getToken, BASE_URL)
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'GET' }),
    )
  })

  it('sets Content-Type: application/json', async () => {
    mockSuccess(null)
    await fetchApi('/path', {}, getToken, BASE_URL)
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }),
    )
  })

  it('injects Authorization header when getToken returns a token', async () => {
    mockSuccess(null)
    await fetchApi('/path', {}, getToken, BASE_URL)
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
      }),
    )
  })

  it('omits Authorization header when getToken returns null', async () => {
    getToken.mockResolvedValue(null)
    mockSuccess(null)
    await fetchApi('/path', {}, getToken, BASE_URL)
    const [, options] = vi.mocked(fetch).mock.calls[0]!
    const headers = options!.headers as Record<string, string>
    expect(headers.Authorization).toBeUndefined()
  })

  it('serializes body as JSON for non-GET requests', async () => {
    mockSuccess(null)
    await fetchApi('/trips', { method: 'POST', body: { title: 'Test' } }, getToken, BASE_URL)
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ body: JSON.stringify({ title: 'Test' }) }),
    )
  })

  it('leaves body undefined when no body is provided', async () => {
    mockSuccess(null)
    await fetchApi('/path', {}, getToken, BASE_URL)
    const [, options] = vi.mocked(fetch).mock.calls[0]!
    expect(options!.body).toBeUndefined()
  })

  it('throws on a 4xx response using the error field from the response body', async () => {
    mockError(404, 'Trip not found')
    await expect(fetchApi('/trips/missing', {}, getToken, BASE_URL)).rejects.toThrow('Trip not found')
  })

  it('throws on a 5xx response', async () => {
    mockError(500, 'Internal Server Error')
    await expect(fetchApi('/path', {}, getToken, BASE_URL)).rejects.toThrow('Internal Server Error')
  })
})
