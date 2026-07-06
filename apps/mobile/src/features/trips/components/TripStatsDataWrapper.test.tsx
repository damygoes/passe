import { render, screen } from '@testing-library/react-native'
import { TripStatsDataWrapper } from './TripStatsDataWrapper'

const mockUseTrips = jest.fn()
const mockUseAllMemories = jest.fn()
jest.mock('@passe/hooks', () => ({
  useTrips: () => mockUseTrips(),
  useAllMemories: () => mockUseAllMemories(),
}))

jest.mock('./TripStats', () => {
  const { Text } = require('react-native')
  return {
    TripStats: ({ countriesCount, citiesCount, yearsCount }: Record<string, number>) => (
      <Text>
        stats:{countriesCount}:{citiesCount}:{yearsCount}
      </Text>
    ),
  }
})

beforeEach(() => {
  mockUseAllMemories.mockReturnValue({ data: [], isLoading: false, isError: false })
})

describe('TripStatsDataWrapper', () => {
  it('shows a skeleton while either query is loading', () => {
    mockUseTrips.mockReturnValue({ data: [], isLoading: true, isError: false })
    const { UNSAFE_root } = render(<TripStatsDataWrapper />)
    expect(UNSAFE_root).toBeTruthy()
    expect(screen.queryByText(/stats:/)).toBeNull()
  })

  it('renders nothing on error', () => {
    mockUseTrips.mockReturnValue({ data: [], isLoading: false, isError: true })
    const { toJSON } = render(<TripStatsDataWrapper />)
    expect(toJSON()).toBeNull()
  })

  it('renders nothing when there are no trips', () => {
    mockUseTrips.mockReturnValue({ data: [], isLoading: false, isError: false })
    const { toJSON } = render(<TripStatsDataWrapper />)
    expect(toJSON()).toBeNull()
  })

  it('renders stats derived from trips and memories', () => {
    mockUseTrips.mockReturnValue({
      data: [{ id: '1', countries: ['FR'], startDate: '2024-01-01', endDate: '2024-01-05' }],
      isLoading: false,
      isError: false,
    })
    mockUseAllMemories.mockReturnValue({
      data: [{ id: 'm1', city: 'Paris' }],
      isLoading: false,
      isError: false,
    })
    render(<TripStatsDataWrapper />)
    expect(screen.getByText('stats:1:1:1')).toBeTruthy()
  })
})
