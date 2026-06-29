import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useTrips, useTrip, useCreateTrip, useUpdateTrip, useDeleteTrip } from '../hooks/use-trips'
import { BASE_URL, createWrapper, mockFetchSuccess } from './test-utils'

const mockTrip = {
  id: 'trip-1',
  userId: 'user-1',
  title: 'Japan Adventure',
  countries: ['JP'],
  startDate: new Date('2024-03-01'),
  endDate: new Date('2024-03-15'),
  isPublic: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetAllMocks()
})

describe('useTrips', () => {
  it('fetches GET /api/trips and returns the trip list', async () => {
    mockFetchSuccess([mockTrip])
    const { result } = renderHook(() => useTrips(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual([mockTrip])
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/trips`, expect.objectContaining({ method: 'GET' }))
  })
})

describe('useTrip', () => {
  it('fetches GET /api/trips/:id for a specific trip', async () => {
    mockFetchSuccess(mockTrip)
    const { result } = renderHook(() => useTrip('trip-1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockTrip)
    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/trips/trip-1`,
      expect.objectContaining({ method: 'GET' }),
    )
  })

  it('does not fetch when id is an empty string', () => {
    const { result } = renderHook(() => useTrip(''), { wrapper: createWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
    expect(fetch).not.toHaveBeenCalled()
  })
})

describe('useCreateTrip', () => {
  it('sends POST /api/trips with the payload', async () => {
    mockFetchSuccess(mockTrip)
    const { result } = renderHook(() => useCreateTrip(), { wrapper: createWrapper() })

    const payload = {
      title: 'Japan Adventure',
      countries: ['JP'],
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-15'),
    }
    await result.current.mutateAsync(payload as Parameters<typeof result.current.mutateAsync>[0])

    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/trips`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    )
  })

  it('returns the created trip', async () => {
    mockFetchSuccess(mockTrip)
    const { result } = renderHook(() => useCreateTrip(), { wrapper: createWrapper() })

    const data = await result.current.mutateAsync(
      mockTrip as Parameters<typeof result.current.mutateAsync>[0],
    )

    expect(data).toEqual(mockTrip)
  })
})

describe('useUpdateTrip', () => {
  it('sends PATCH /api/trips/:id with the update payload', async () => {
    mockFetchSuccess({ ...mockTrip, title: 'Updated' })
    const { result } = renderHook(() => useUpdateTrip(), { wrapper: createWrapper() })

    await result.current.mutateAsync({ id: 'trip-1', title: 'Updated' })

    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/trips/trip-1`,
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ title: 'Updated' }),
      }),
    )
  })
})

describe('useDeleteTrip', () => {
  it('sends DELETE /api/trips/:id', async () => {
    mockFetchSuccess({ id: 'trip-1' })
    const { result } = renderHook(() => useDeleteTrip(), { wrapper: createWrapper() })

    await result.current.mutateAsync('trip-1')

    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/trips/trip-1`,
      expect.objectContaining({ method: 'DELETE' }),
    )
  })
})
