import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import { mockPush, mockReplace } from '@/test/expo-router-mock'
import { mockSetActive, mockSignUp } from '@/test/clerk-expo-mock'
import { SignUpScreen } from './SignUpScreen'

async function fillDetails(overrides: { password?: string; confirmPassword?: string } = {}) {
  render(<SignUpScreen />)
  fireEvent.changeText(screen.getByPlaceholderText('display_name_placeholder'), 'Traveler')
  fireEvent.changeText(screen.getByPlaceholderText('email_placeholder'), 'user@example.com')
  const passwordFields = screen.getAllByPlaceholderText('password_placeholder')
  fireEvent.changeText(passwordFields[0]!, overrides.password ?? 'Abcdef1!')
  fireEvent.changeText(passwordFields[1]!, overrides.confirmPassword ?? overrides.password ?? 'Abcdef1!')
}

describe('SignUpScreen', () => {
  it('renders all detail fields', () => {
    render(<SignUpScreen />)
    expect(screen.getByPlaceholderText('display_name_placeholder')).toBeTruthy()
    expect(screen.getByPlaceholderText('email_placeholder')).toBeTruthy()
    expect(screen.getAllByPlaceholderText('password_placeholder')).toHaveLength(2)
  })

  it('shows a live mismatch indicator before submitting', () => {
    render(<SignUpScreen />)
    const passwordFields = screen.getAllByPlaceholderText('password_placeholder')
    fireEvent.changeText(passwordFields[0]!, 'Abcdef1!')
    fireEvent.changeText(passwordFields[1]!, 'different')
    expect(screen.getByText('no_match')).toBeTruthy()
  })

  it('moves to the OTP step after successful details submission', async () => {
    await fillDetails()
    fireEvent.press(screen.getByText('create_account'))

    expect(await screen.findByPlaceholderText('verification_code_placeholder')).toBeTruthy()
  })

  it('redirects to trips once OTP verification completes', async () => {
    jest.mocked(mockSignUp.attemptEmailAddressVerification).mockResolvedValueOnce({
      status: 'complete',
      createdSessionId: 'sess_1',
    })

    await fillDetails()
    fireEvent.press(screen.getByText('create_account'))
    const otpInput = await screen.findByPlaceholderText('verification_code_placeholder')
    fireEvent.changeText(otpInput, '123456')
    fireEvent.press(screen.getByText('verify_email'))

    await waitFor(() => expect(mockSetActive).toHaveBeenCalledWith({ session: 'sess_1' }))
    expect(mockReplace).toHaveBeenCalledWith('/(app)/trips')
  })

  it('shows a generic error banner when sign-up creation throws', async () => {
    jest.mocked(mockSignUp.create).mockRejectedValueOnce(new Error('network error'))

    await fillDetails()
    fireEvent.press(screen.getByText('create_account'))

    expect(await screen.findByText('generic')).toBeTruthy()
  })

  it('navigates to sign-in via the footer link', () => {
    render(<SignUpScreen />)
    fireEvent.press(screen.getByText('sign_in_link'))
    expect(mockPush).toHaveBeenCalledWith('/(auth)/sign-in')
  })
})
