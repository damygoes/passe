import * as Sharing from 'expo-sharing'
import { fetch } from 'expo/fetch'
import { haptics } from '@/lib/haptics'
import { PlanGateError, ShareUnavailableError, downloadTripExport } from './downloadTripExport'

const mockWrite = jest.fn()
const mockDelete = jest.fn()

jest.mock('expo/fetch', () => ({ fetch: jest.fn() }))

jest.mock('expo-file-system', () => ({
  File: jest.fn().mockImplementation((_dir: unknown, name: string) => ({
    uri: `file:///cache/${name}`,
    exists: false,
    write: mockWrite,
    delete: mockDelete,
  })),
  Paths: { cache: 'file:///cache' },
}))

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  shareAsync: jest.fn().mockResolvedValue(undefined),
}))

jest.mock('@/lib/haptics', () => ({
  haptics: { success: jest.fn(), error: jest.fn() },
}))

const baseOptions = {
  path: '/api/trips/trip-1/pdf',
  fallbackFilename: 'memory-book.pdf',
  baseUrl: 'http://localhost:3000',
  getToken: async () => 'test-token',
}

function mockPdfResponse(contentDisposition: string | null) {
  jest.mocked(fetch).mockResolvedValue({
    ok: true,
    headers: { get: () => contentDisposition },
    arrayBuffer: async () => new ArrayBuffer(8),
  } as unknown as Awaited<ReturnType<typeof fetch>>)
}

describe('downloadTripExport', () => {
  it('fetches with auth, writes the PDF to cache, and opens the share sheet', async () => {
    mockPdfResponse('attachment; filename="japan-adventure.pdf"')

    await downloadTripExport(baseOptions)

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/trips/trip-1/pdf',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
      }),
    )
    expect(mockWrite).toHaveBeenCalledWith(expect.any(Uint8Array))
    expect(Sharing.shareAsync).toHaveBeenCalledWith(
      'file:///cache/japan-adventure.pdf',
      expect.objectContaining({ mimeType: 'application/pdf' }),
    )
    expect(haptics.success).toHaveBeenCalled()
  })

  it('serializes a POST body and falls back to the default filename', async () => {
    mockPdfResponse(null)

    await downloadTripExport({
      ...baseOptions,
      path: '/api/trips/trip-1/zine',
      method: 'POST',
      body: { memoryIds: ['m1'] },
      fallbackFilename: 'zine.pdf',
    })

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/trips/trip-1/zine',
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ memoryIds: ['m1'] }) }),
    )
    expect(Sharing.shareAsync).toHaveBeenCalledWith('file:///cache/zine.pdf', expect.anything())
  })

  it('throws the server error message on a non-2xx response', async () => {
    jest.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({ error: 'Failed to generate postcard' }),
    } as unknown as Awaited<ReturnType<typeof fetch>>)

    await expect(downloadTripExport(baseOptions)).rejects.toThrow('Failed to generate postcard')
    expect(haptics.error).toHaveBeenCalled()
    expect(Sharing.shareAsync).not.toHaveBeenCalled()
  })

  // Callers show the upgrade path for this one, so it must be distinguishable
  // from a generic failure — and the server's message is English-only.
  it('throws PlanGateError on a 403 so callers can offer an upgrade', async () => {
    jest.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
      json: async () => ({ error: 'Upgrade to Collector to export a postcard' }),
    } as unknown as Awaited<ReturnType<typeof fetch>>)

    await expect(downloadTripExport(baseOptions)).rejects.toThrow(PlanGateError)
    expect(haptics.error).toHaveBeenCalled()
    expect(Sharing.shareAsync).not.toHaveBeenCalled()
  })

  it('throws ShareUnavailableError when the device cannot share', async () => {
    jest.mocked(Sharing.isAvailableAsync).mockResolvedValueOnce(false)

    await expect(downloadTripExport(baseOptions)).rejects.toBeInstanceOf(ShareUnavailableError)
    expect(fetch).not.toHaveBeenCalled()
  })
})
