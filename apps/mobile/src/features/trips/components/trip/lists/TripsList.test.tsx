import { fireEvent, render, screen } from '@testing-library/react-native'
import { mockPush } from '@/test/expo-router-mock'
import { TripsList } from './TripsList'

const mockUseTrips = jest.fn()
const mockUseAllMemories = jest.fn()
const mockUseUser = jest.fn()
jest.mock('@passe/hooks', () => ({
  useTrips: () => mockUseTrips(),
  useAllMemories: () => mockUseAllMemories(),
  useUser: () => mockUseUser(),
}))

jest.mock('./TripsListSkeleton', () => {
  const { Text } = require('react-native')
  return { TripsListSkeleton: () => <Text>loading-skeleton</Text> }
})
jest.mock('@/features/trips/components/trip/empty/NoTripsEmpty', () => {
  const { Text } = require('react-native')
  return { NoTripsEmpty: () => <Text>no-trips</Text> }
})
jest.mock('./TripRow', () => {
  const { Text, TouchableOpacity } = require('react-native')
  return {
    TripRow: ({
      trip,
      isShared,
      onPress,
    }: {
      trip: { title: string }
      isShared: boolean
      onPress: () => void
    }) => (
      <TouchableOpacity onPress={onPress}>
        <Text>
          {trip.title}:{isShared ? 'shared' : 'private'}
        </Text>
      </TouchableOpacity>
    ),
  }
})

interface TestTrip {
  id: string
  title: string
  startDate?: string
  endDate?: string
}

function trip(overrides: Partial<TestTrip> & { id: string; title: string }): TestTrip {
  return { startDate: '2026-03-07', endDate: '2026-03-16', ...overrides }
}

function setup({
  trips = [] as TestTrip[],
  memories = [] as { tripId: string; city?: string | null; isPublic?: boolean }[],
  user = { plan: 'free' } as { plan: 'free' | 'explorer' | 'collector' } | undefined,
} = {}) {
  mockUseTrips.mockReturnValue({ data: trips, isLoading: false, isError: false })
  mockUseAllMemories.mockReturnValue({ data: memories, isLoading: false, isError: false })
  mockUseUser.mockReturnValue({ data: user })
}

describe('TripsList', () => {
  it('shows a skeleton while loading', () => {
    mockUseTrips.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    mockUseAllMemories.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    mockUseUser.mockReturnValue({ data: undefined })
    render(<TripsList filter="all" />)
    expect(screen.getByText('loading-skeleton')).toBeTruthy()
  })

  it('shows an error message on error', () => {
    mockUseTrips.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    mockUseAllMemories.mockReturnValue({ data: undefined, isLoading: false, isError: false })
    mockUseUser.mockReturnValue({ data: undefined })
    render(<TripsList filter="all" />)
    expect(screen.getByText('trips_error')).toBeTruthy()
  })

  it('shows the empty state when there are no trips', () => {
    setup({ trips: [] })
    render(<TripsList filter="all" />)
    expect(screen.getByText('no-trips')).toBeTruthy()
  })

  it('renders a row per trip and navigates on press', () => {
    setup({
      trips: [trip({ id: '1', title: 'Japan' }), trip({ id: '2', title: 'France' })],
      memories: [{ tripId: '1', city: 'Tokyo', isPublic: true }],
    })
    render(<TripsList filter="all" />)
    expect(screen.getByText('Japan:shared')).toBeTruthy()
    expect(screen.getByText('France:private')).toBeTruthy()

    fireEvent.press(screen.getByText('Japan:shared'))
    expect(mockPush).toHaveBeenCalledWith('/(app)/trips/1')
  })

  it('filters to private trips only', () => {
    setup({
      trips: [trip({ id: '1', title: 'Japan' }), trip({ id: '2', title: 'France' })],
      memories: [{ tripId: '1', city: 'Tokyo', isPublic: true }],
    })
    render(<TripsList filter="private" />)
    expect(screen.queryByText('Japan:shared')).toBeNull()
    expect(screen.getByText('France:private')).toBeTruthy()
  })

  it('filters to shared trips only', () => {
    setup({
      trips: [trip({ id: '1', title: 'Japan' }), trip({ id: '2', title: 'France' })],
      memories: [{ tripId: '1', city: 'Tokyo', isPublic: true }],
    })
    render(<TripsList filter="shared" />)
    expect(screen.getByText('Japan:shared')).toBeTruthy()
    expect(screen.queryByText('France:private')).toBeNull()
  })

  it('shows the quota meter for a limited plan', () => {
    setup({ trips: [trip({ id: '1', title: 'Japan' })], user: { plan: 'free' } })
    render(<TripsList filter="all" />)
    expect(screen.getByText('quota_cta')).toBeTruthy()
  })

  it('hides the quota meter for an unlimited plan', () => {
    setup({ trips: [trip({ id: '1', title: 'Japan' })], user: { plan: 'collector' } })
    render(<TripsList filter="all" />)
    expect(screen.queryByText('quota_cta')).toBeNull()
  })
})
