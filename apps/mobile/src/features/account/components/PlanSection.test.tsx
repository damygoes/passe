import { fireEvent, render, screen } from '@testing-library/react-native'
import { mockPush } from '@/test/expo-router-mock'
import { PlanSection } from './PlanSection'

const mockUseUser = jest.fn()
jest.mock('@passe/hooks', () => ({
  useUser: () => mockUseUser(),
}))

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

  it('hides silently on error', () => {
    mockUseUser.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    const { toJSON } = render(<PlanSection />)
    expect(toJSON()).toBeNull()
  })
})
