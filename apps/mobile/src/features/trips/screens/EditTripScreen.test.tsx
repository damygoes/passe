import { render, screen } from '@testing-library/react-native'
import { setMockSearchParams } from '@/test/expo-router-mock'
import { EditTripScreen } from './EditTripScreen'

const mockUseTrip = jest.fn()
jest.mock('@passe/hooks', () => ({ useTrip: (id: string) => mockUseTrip(id) }))

jest.mock('@/features/trips/components/trip/forms/TripForm', () => {
  const { Text } = require('react-native')
  return { TripForm: ({ trip }: { trip: { title: string } }) => <Text>trip-form:{trip.title}</Text> }
})

beforeEach(() => {
  setMockSearchParams({ id: 'trip-1' })
})

describe('EditTripScreen', () => {
  it('shows a loading skeleton while fetching', () => {
    mockUseTrip.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    render(<EditTripScreen />)
    expect(screen.queryByText(/trip-form/)).toBeNull()
  })

  it('shows an error banner when the trip fails to load', () => {
    mockUseTrip.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    render(<EditTripScreen />)
    expect(screen.getByText('trip_error')).toBeTruthy()
  })

  it('renders the trip form once loaded', () => {
    mockUseTrip.mockReturnValue({ data: { title: 'Japan' }, isLoading: false, isError: false })
    render(<EditTripScreen />)
    expect(screen.getByText('trip-form:Japan')).toBeTruthy()
  })
})
