import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import { mockPush, setMockSearchParams } from '@/test/expo-router-mock'
import { PlanGateError, downloadTripExport } from '@/features/trips/utils/downloadTripExport'
import { PostcardExportScreen } from './PostcardExportScreen'

const mockUseUser = jest.fn()
const mockUseMemories = jest.fn()
jest.mock('@passe/hooks', () => ({
  useUser: () => mockUseUser(),
  useMemories: () => mockUseMemories(),
  usePasseApi: () => ({
    baseUrl: 'http://localhost:3000',
    getToken: async () => 'test-token',
    fetchApi: jest.fn(),
  }),
}))

jest.mock('@/features/trips/utils/downloadTripExport', () => ({
  downloadTripExport: jest.fn().mockResolvedValue(undefined),
  ShareUnavailableError: class ShareUnavailableError extends Error {},
  PlanGateError: class PlanGateError extends Error {},
}))

const memories = [
  { id: 'memory-1', media: [{ url: 'https://example.test/one.jpg' }] },
  { id: 'memory-2', media: [{ url: 'https://example.test/two.jpg' }] },
]

describe('PostcardExportScreen', () => {
  beforeEach(() => {
    setMockSearchParams({ id: 'trip-1' })
    mockUseMemories.mockReturnValue({ data: memories, isLoading: false, isError: false })
  })

  it('pre-selects the memory it was opened for, so the submit works on mount', async () => {
    mockUseUser.mockReturnValue({ data: { plan: 'collector' } })
    setMockSearchParams({ id: 'trip-1', memoryId: 'memory-2' })
    render(<PostcardExportScreen />)

    expect(screen.queryByText('postcard_select_hint')).toBeNull()
    fireEvent.press(screen.getByText('postcard_generate'))

    await waitFor(() =>
      expect(downloadTripExport).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/api/trips/trip-1/postcard',
          body: { memoryId: 'memory-2', message: undefined },
        }),
      ),
    )
  })

  it('explains why the submit is disabled when nothing is selected yet', () => {
    mockUseUser.mockReturnValue({ data: { plan: 'collector' } })
    render(<PostcardExportScreen />)

    expect(screen.getByText('postcard_select_hint')).toBeTruthy()
    fireEvent.press(screen.getByText('postcard_generate'))
    expect(downloadTripExport).not.toHaveBeenCalled()
  })

  it('offers an upgrade instead of a dead submit button on the free plan', () => {
    mockUseUser.mockReturnValue({ data: { plan: 'free' } })
    setMockSearchParams({ id: 'trip-1', memoryId: 'memory-1' })
    render(<PostcardExportScreen />)

    expect(screen.getByText('postcard_locked_message')).toBeTruthy()
    expect(screen.queryByText('postcard_generate')).toBeNull()

    fireEvent.press(screen.getByText('locked_cta'))
    expect(mockPush).toHaveBeenCalledWith('/(app)/account/paywall?reason=postcard')
    expect(downloadTripExport).not.toHaveBeenCalled()
  })

  it('turns a 403 into the upgrade path rather than a retry message', async () => {
    mockUseUser.mockReturnValue({ data: { plan: 'collector' } })
    setMockSearchParams({ id: 'trip-1', memoryId: 'memory-1' })
    jest.mocked(downloadTripExport).mockRejectedValueOnce(new PlanGateError())
    render(<PostcardExportScreen />)

    fireEvent.press(screen.getByText('postcard_generate'))

    await waitFor(() => expect(screen.getByText('postcard_locked_message')).toBeTruthy())
    expect(screen.queryByText('postcard_generate_failed')).toBeNull()
  })

  it('surfaces a genuine generation failure inline', async () => {
    mockUseUser.mockReturnValue({ data: { plan: 'collector' } })
    setMockSearchParams({ id: 'trip-1', memoryId: 'memory-1' })
    jest.mocked(downloadTripExport).mockRejectedValueOnce(new Error('server exploded'))
    render(<PostcardExportScreen />)

    fireEvent.press(screen.getByText('postcard_generate'))

    await waitFor(() => expect(screen.getByText('postcard_generate_failed')).toBeTruthy())
    expect(screen.queryByText('postcard_locked_message')).toBeNull()
  })
})
