import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import { mockBack, setMockSearchParams } from '@/test/expo-router-mock'
import { downloadTripExport } from '@/features/trips/utils/downloadTripExport'
import { ZineExportScreen } from './ZineExportScreen'

const mockUseMemories = jest.fn()
jest.mock('@passe/hooks', () => ({
  useMemories: (tripId: string) => mockUseMemories(tripId),
  usePasseApi: () => ({
    baseUrl: 'http://localhost:3000',
    getToken: async () => 'test-token',
    fetchApi: jest.fn(),
  }),
}))

jest.mock('@/features/trips/utils/downloadTripExport', () => ({
  downloadTripExport: jest.fn().mockResolvedValue(undefined),
  ShareUnavailableError: class ShareUnavailableError extends Error {},
}))

function makeMemory(id: string, withPhoto = true) {
  return {
    id,
    media: withPhoto ? [{ url: `https://example.com/${id}.jpg`, mediaType: 'photo' }] : [],
  }
}

const sixMemories = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'].map((id) => makeMemory(id))

describe('ZineExportScreen', () => {
  beforeEach(() => {
    setMockSearchParams({ id: 'trip-1' })
    mockUseMemories.mockReturnValue({ data: sixMemories, isLoading: false, isError: false })
  })

  it('shows the empty message when no memories have photos', () => {
    mockUseMemories.mockReturnValue({
      data: [makeMemory('m1', false)],
      isLoading: false,
      isError: false,
    })
    render(<ZineExportScreen />)
    expect(screen.getByText('zine_no_photos')).toBeTruthy()
  })

  it('shows an error banner when memories fail to load', () => {
    mockUseMemories.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    render(<ZineExportScreen />)
    expect(screen.getByText('zine_memories_error')).toBeTruthy()
  })

  it('disables generate until exactly six photos are selected', () => {
    render(<ZineExportScreen />)
    const generate = screen.getByText('zine_generate')

    fireEvent.press(generate)
    expect(downloadTripExport).not.toHaveBeenCalled()

    const tiles = screen.getAllByRole('button')
    // First five selections still not enough
    for (let index = 0; index < 5; index++) fireEvent.press(tiles[index])
    fireEvent.press(generate)
    expect(downloadTripExport).not.toHaveBeenCalled()
  })

  it('numbers selections in tap order and generates with the ordered ids', async () => {
    render(<ZineExportScreen />)
    const tiles = screen.getAllByRole('button')

    // Tap in a scrambled order — the POST body must preserve tap order
    const order = [2, 0, 5, 1, 4, 3]
    for (const index of order) fireEvent.press(tiles[index])

    // The first-tapped tile shows badge "1"
    expect(screen.getByText('1')).toBeTruthy()
    expect(screen.getByText('6')).toBeTruthy()

    fireEvent.press(screen.getByText('zine_generate'))

    await waitFor(() => expect(downloadTripExport).toHaveBeenCalled())
    expect(downloadTripExport).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/api/trips/trip-1/zine',
        method: 'POST',
        body: { memoryIds: ['m3', 'm1', 'm6', 'm2', 'm5', 'm4'] },
      }),
    )
    await waitFor(() => expect(mockBack).toHaveBeenCalled())
  })

  it('toggling a selected photo off re-enables selection of others', () => {
    render(<ZineExportScreen />)
    const tiles = screen.getAllByRole('button')

    for (let index = 0; index < 6; index++) fireEvent.press(tiles[index])
    // Deselect the first, select the last again — badge renumbers
    fireEvent.press(tiles[0])
    fireEvent.press(tiles[0])
    expect(screen.getByText('6')).toBeTruthy()
  })
})
