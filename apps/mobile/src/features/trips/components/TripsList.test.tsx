import { fireEvent, render, screen } from '@testing-library/react-native'
import { mockPush } from '@/test/expo-router-mock'
import { TripsList } from './TripsList'

const mockUseTrips = jest.fn()
jest.mock('@passe/hooks', () => ({ useTrips: () => mockUseTrips() }))

jest.mock('./TripsListSkeleton', () => {
  const { Text } = require('react-native')
  return { TripsListSkeleton: () => <Text>loading-skeleton</Text> }
})
jest.mock('./NoTripsEmpty', () => {
  const { Text } = require('react-native')
  return { NoTripsEmpty: () => <Text>no-trips</Text> }
})
jest.mock('./TripCard', () => {
  const { Text, TouchableOpacity } = require('react-native')
  return {
    TripCard: ({ trip, onPress }: { trip: { id: string; title: string }; onPress: () => void }) => (
      <TouchableOpacity onPress={onPress}>
        <Text>{trip.title}</Text>
      </TouchableOpacity>
    ),
  }
})

describe('TripsList', () => {
  it('shows a skeleton while loading', () => {
    mockUseTrips.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    render(<TripsList />)
    expect(screen.getByText('loading-skeleton')).toBeTruthy()
  })

  it('shows an error message on error', () => {
    mockUseTrips.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    render(<TripsList />)
    expect(screen.getByText('trips_error')).toBeTruthy()
  })

  it('shows the empty state when there are no trips', () => {
    mockUseTrips.mockReturnValue({ data: [], isLoading: false, isError: false })
    render(<TripsList />)
    expect(screen.getByText('no-trips')).toBeTruthy()
  })

  it('renders a card per trip and navigates on press', () => {
    mockUseTrips.mockReturnValue({
      data: [{ id: '1', title: 'Japan' }, { id: '2', title: 'France' }],
      isLoading: false,
      isError: false,
    })
    render(<TripsList />)
    expect(screen.getByText('Japan')).toBeTruthy()
    expect(screen.getByText('France')).toBeTruthy()

    fireEvent.press(screen.getByText('Japan'))
    expect(mockPush).toHaveBeenCalledWith('/(app)/trips/1')
  })
})
