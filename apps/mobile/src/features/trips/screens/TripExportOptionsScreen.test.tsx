import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import { mockPush, mockReplace, setMockSearchParams } from '@/test/expo-router-mock'
import { downloadTripExport } from '@/features/trips/utils/downloadTripExport'
import { TripExportOptionsScreen } from './TripExportOptionsScreen'

const mockUseUser = jest.fn()
jest.mock('@passe/hooks', () => ({
  useUser: () => mockUseUser(),
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

describe('TripExportOptionsScreen', () => {
  beforeEach(() => {
    setMockSearchParams({ id: 'trip-1' })
  })

  it('shows Collector badges and opens the paywall instead of the gated action on the free plan', () => {
    mockUseUser.mockReturnValue({ data: { plan: 'free' } })
    render(<TripExportOptionsScreen />)

    expect(screen.getAllByText('collector_badge')).toHaveLength(3)
    fireEvent.press(screen.getByText('create_zine'))
    expect(mockReplace).not.toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/(app)/account/paywall')

    fireEvent.press(screen.getByText('download_pdf'))
    expect(downloadTripExport).not.toHaveBeenCalled()
  })

  it('downloads the memory book PDF on the collector plan', async () => {
    mockUseUser.mockReturnValue({ data: { plan: 'collector' } })
    render(<TripExportOptionsScreen />)

    expect(screen.queryByText('collector_badge')).toBeNull()
    fireEvent.press(screen.getByText('download_pdf'))

    await waitFor(() =>
      expect(downloadTripExport).toHaveBeenCalledWith(
        expect.objectContaining({ path: '/api/trips/trip-1/pdf' }),
      ),
    )
  })

  it('opens the zine and postcard pickers in place of this sheet', () => {
    mockUseUser.mockReturnValue({ data: { plan: 'collector' } })
    render(<TripExportOptionsScreen />)

    fireEvent.press(screen.getByText('create_zine'))
    expect(mockReplace).toHaveBeenCalledWith('/(app)/trips/export-zine/trip-1')

    fireEvent.press(screen.getByText('create_postcard'))
    expect(mockReplace).toHaveBeenCalledWith('/(app)/trips/export-postcard/trip-1')
  })

  it('surfaces a download error inline', async () => {
    mockUseUser.mockReturnValue({ data: { plan: 'collector' } })
    jest.mocked(downloadTripExport).mockRejectedValueOnce(new Error('server exploded'))
    render(<TripExportOptionsScreen />)

    fireEvent.press(screen.getByText('download_pdf'))
    await waitFor(() => expect(screen.getByText('export_download_failed')).toBeTruthy())
  })
})
