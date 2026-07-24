import { render, screen } from '@testing-library/react-native'
import type { SharedValue } from 'react-native-reanimated'
import { TripDetailHeader } from './TripDetailHeader'

const mockUseTrip = jest.fn()
jest.mock('@passe/hooks', () => ({
  useTrip: (id: string) => mockUseTrip(id),
}))

// The reanimated jest mock models shared values as plain { value } objects
const scrollY = { value: 0 } as SharedValue<number>

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

// Edit/delete/export interactions moved to TripActionsScreen (the nav-bar ⋯
// sheet) — see TripActionsScreen.test.tsx.
describe('TripDetailHeader', () => {
  it('shows a skeleton while loading', () => {
    mockUseTrip.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    render(<TripDetailHeader id="trip-1" scrollY={scrollY} />)
    expect(screen.getByText('loading-skeleton')).toBeTruthy()
  })

  it('shows an error banner when the trip fails to load', () => {
    mockUseTrip.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    render(<TripDetailHeader id="trip-1" scrollY={scrollY} />)
    expect(screen.getByText('trip_error')).toBeTruthy()
  })

  it('renders the trip title, countries, and description', () => {
    mockUseTrip.mockReturnValue({ data: mockTrip, isLoading: false, isError: false })
    render(<TripDetailHeader id="trip-1" scrollY={scrollY} />)
    expect(screen.getByText('Japan Adventure')).toBeTruthy()
    expect(screen.getByText('JP')).toBeTruthy()
    expect(screen.getByText('A wonderful trip')).toBeTruthy()
  })

  it('does not render a description when the trip has none', () => {
    mockUseTrip.mockReturnValue({
      data: { ...mockTrip, description: null },
      isLoading: false,
      isError: false,
    })
    render(<TripDetailHeader id="trip-1" scrollY={scrollY} />)
    expect(screen.queryByText('A wonderful trip')).toBeNull()
  })

  it('falls back to the branded hero with the trip initial when there is no cover', () => {
    mockUseTrip.mockReturnValue({
      data: { ...mockTrip, coverImageUrl: null },
      isLoading: false,
      isError: false,
    })
    render(<TripDetailHeader id="trip-1" scrollY={scrollY} />)
    expect(screen.getByText('J')).toBeTruthy()
    expect(screen.getByText('Japan Adventure')).toBeTruthy()
  })
})
