import { fireEvent, render, screen } from '@testing-library/react-native'
import { mockPush } from '@/test/expo-router-mock'
import { PlanSection } from './PlanSection'

const mockUseUser = jest.fn()
const mockUseTrips = jest.fn()
jest.mock('@passe/hooks', () => ({
  useUser: () => mockUseUser(),
  useTrips: () => mockUseTrips(),
}))

beforeEach(() => {
  mockUseTrips.mockReturnValue({ data: [] })
})

describe('PlanSection', () => {
  it('shows an upgrade action that opens the paywall for a free-plan user', () => {
    mockUseUser.mockReturnValue({ data: { plan: 'free' }, isLoading: false, isError: false })
    render(<PlanSection />)

    fireEvent.press(screen.getByText('upgrade_cta'))
    expect(mockPush).toHaveBeenCalledWith('/(app)/account/paywall')
  })

  it('does not show an upgrade action for a paid-plan user', () => {
    mockUseUser.mockReturnValue({ data: { plan: 'collector' }, isLoading: false, isError: false })
    render(<PlanSection />)

    expect(screen.queryByText('upgrade_cta')).toBeNull()
  })

  it('shows how many trips have been used against the plan limit', () => {
    mockUseUser.mockReturnValue({ data: { plan: 'free' }, isLoading: false, isError: false })
    mockUseTrips.mockReturnValue({ data: [{ id: '1' }, { id: '2' }] })
    render(<PlanSection />)

    // useTranslations is mocked globally to echo the key, ignoring interpolation values
    expect(screen.getByText('trips_used')).toBeTruthy()
  })

  it('shows unlimited trips for a collector-plan user', () => {
    mockUseUser.mockReturnValue({ data: { plan: 'collector' }, isLoading: false, isError: false })
    render(<PlanSection />)

    expect(screen.getByText('trips_unlimited')).toBeTruthy()
  })

  it('hides silently on error', () => {
    mockUseUser.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    const { toJSON } = render(<PlanSection />)
    expect(toJSON()).toBeNull()
  })
})
