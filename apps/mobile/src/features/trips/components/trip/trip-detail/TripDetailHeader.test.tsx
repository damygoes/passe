import { fireEvent, render, screen } from '@testing-library/react-native'
import { mockPush } from '@/test/expo-router-mock'
import { TripDetailHeader } from './TripDetailHeader'

const mockUseTrip = jest.fn()
const mockDeleteMutate = jest.fn()
jest.mock('@passe/hooks', () => ({
  useTrip: (id: string) => mockUseTrip(id),
  useDeleteTrip: () => ({ mutate: mockDeleteMutate, isPending: false }),
}))

jest.mock('./TripDetailHeaderSkeleton', () => {
  const { Text } = require('react-native')
  return { TripDetailHeaderSkeleton: () => <Text>loading-skeleton</Text> }
})

const mockTrip = {
  id: 'trip-1',
  title: 'Japan Adventure',
  description: 'A wonderful trip',
  countries: ['JP'],
  coverImageUrl: 'https://example.com/cover.jpg',
  startDate: new Date('2024-03-01'),
  endDate: new Date('2024-03-15'),
}

describe('TripDetailHeader', () => {
  it('shows a skeleton while loading', () => {
    mockUseTrip.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    render(<TripDetailHeader id="trip-1" />)
    expect(screen.getByText('loading-skeleton')).toBeTruthy()
  })

  it('shows an error banner when the trip fails to load', () => {
    mockUseTrip.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    render(<TripDetailHeader id="trip-1" />)
    expect(screen.getByText('trip_error')).toBeTruthy()
  })

  it('renders the trip title, countries, and description', () => {
    mockUseTrip.mockReturnValue({ data: mockTrip, isLoading: false, isError: false })
    render(<TripDetailHeader id="trip-1" />)
    expect(screen.getByText('Japan Adventure')).toBeTruthy()
    expect(screen.getByText('JP')).toBeTruthy()
    expect(screen.getByText('A wonderful trip')).toBeTruthy()
  })

  it('navigates to the edit screen when the edit button is pressed', () => {
    mockUseTrip.mockReturnValue({ data: mockTrip, isLoading: false, isError: false })
    render(<TripDetailHeader id="trip-1" />)
    fireEvent.press(screen.getByText('edit'))
    expect(mockPush).toHaveBeenCalledWith('/(app)/trips/edit/trip-1')
  })

  it('does not render a description when the trip has none', () => {
    mockUseTrip.mockReturnValue({ data: { ...mockTrip, description: null }, isLoading: false, isError: false })
    render(<TripDetailHeader id="trip-1" />)
    expect(screen.queryByText('A wonderful trip')).toBeNull()
  })
})
