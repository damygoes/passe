import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import { mockReplace } from '@/test/expo-router-mock'
import { mockSignOut } from '@/test/clerk-expo-mock'
import { DangerZoneScreen } from './DangerZoneScreen'

const mockDeleteAccount = jest.fn()
let mockUserData: { planSource?: string | null } | undefined = undefined
jest.mock('@passe/hooks', () => ({
  useDeleteAccount: () => ({ mutateAsync: mockDeleteAccount, isPending: false }),
  useUser: () => ({ data: mockUserData }),
}))

function openDialog() {
  const deleteButtons = screen.getAllByText('delete')
  fireEvent.press(deleteButtons[0]!)
}

describe('DangerZoneScreen', () => {
  beforeEach(() => {
    mockUserData = undefined
  })

  it('keeps the confirm action disabled until the exact phrase is typed', () => {
    render(<DangerZoneScreen />)
    openDialog()

    const confirmButtons = screen.getAllByText('delete')
    fireEvent.press(confirmButtons[confirmButtons.length - 1]!)
    expect(mockDeleteAccount).not.toHaveBeenCalled()

    fireEvent.changeText(screen.getByPlaceholderText('confirm_placeholder'), 'delete my account')
    fireEvent.press(screen.getAllByText('delete')[confirmButtons.length - 1]!)
    expect(mockDeleteAccount).toHaveBeenCalled()
  })

  it('deletes the account, signs out, and redirects to sign-in on confirm', async () => {
    mockDeleteAccount.mockResolvedValue({})
    render(<DangerZoneScreen />)
    openDialog()

    fireEvent.changeText(screen.getByPlaceholderText('confirm_placeholder'), 'delete my account')
    const confirmButtons = screen.getAllByText('delete')
    fireEvent.press(confirmButtons[confirmButtons.length - 1]!)

    await waitFor(() => expect(mockDeleteAccount).toHaveBeenCalled())
    expect(mockSignOut).toHaveBeenCalled()
    expect(mockReplace).toHaveBeenCalledWith('/(auth)/sign-in')
  })

  it('shows an error message when deletion fails', async () => {
    mockDeleteAccount.mockRejectedValue(new Error('delete failed'))
    render(<DangerZoneScreen />)
    openDialog()

    fireEvent.changeText(screen.getByPlaceholderText('confirm_placeholder'), 'delete my account')
    const confirmButtons = screen.getAllByText('delete')
    fireEvent.press(confirmButtons[confirmButtons.length - 1]!)

    expect(await screen.findByText('delete failed')).toBeTruthy()
    expect(mockSignOut).not.toHaveBeenCalled()
  })

  it('shows the IAP cancellation warning only for RevenueCat-sourced subscribers', () => {
    mockUserData = { planSource: 'revenuecat' }
    render(<DangerZoneScreen />)
    openDialog()

    expect(screen.getByText('iap_cancel_warning')).toBeTruthy()
  })

  it('does not show the IAP cancellation warning for Stripe-sourced subscribers', () => {
    mockUserData = { planSource: 'stripe' }
    render(<DangerZoneScreen />)
    openDialog()

    expect(screen.queryByText('iap_cancel_warning')).toBeNull()
  })
})
