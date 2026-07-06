import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import { mockPush, mockReplace } from '@/test/expo-router-mock'
import { mockSetActive, mockSignIn } from '@/test/clerk-expo-mock'
import { ForgotPasswordScreen } from './ForgotPasswordScreen'

describe('ForgotPasswordScreen — request step', () => {
  it('renders the email field', () => {
    render(<ForgotPasswordScreen />)
    expect(screen.getByPlaceholderText('email_placeholder')).toBeTruthy()
  })

  it('shows a custom validation error for a malformed email', async () => {
    render(<ForgotPasswordScreen />)
    fireEvent.changeText(screen.getByPlaceholderText('email_placeholder'), 'not-an-email')
    fireEvent.press(screen.getByText('send_reset_code'))
    expect(await screen.findByText('invalid_email')).toBeTruthy()
  })

  it('moves to the reset step on success', async () => {
    render(<ForgotPasswordScreen />)
    fireEvent.changeText(screen.getByPlaceholderText('email_placeholder'), 'user@example.com')
    fireEvent.press(screen.getByText('send_reset_code'))

    expect(await screen.findByPlaceholderText('verification_code_placeholder')).toBeTruthy()
  })

  it('shows a generic error banner when the request throws', async () => {
    jest.mocked(mockSignIn.create).mockRejectedValueOnce(new Error('network error'))
    render(<ForgotPasswordScreen />)
    fireEvent.changeText(screen.getByPlaceholderText('email_placeholder'), 'user@example.com')
    fireEvent.press(screen.getByText('send_reset_code'))

    expect(await screen.findByText('generic')).toBeTruthy()
  })

  it('navigates back to sign-in via the footer link', () => {
    render(<ForgotPasswordScreen />)
    fireEvent.press(screen.getByText('back_to_sign_in'))
    expect(mockPush).toHaveBeenCalledWith('/(auth)/sign-in')
  })
})

describe('ForgotPasswordScreen — reset step', () => {
  async function moveToResetStep() {
    render(<ForgotPasswordScreen />)
    fireEvent.changeText(screen.getByPlaceholderText('email_placeholder'), 'user@example.com')
    fireEvent.press(screen.getByText('send_reset_code'))
    await screen.findByPlaceholderText('verification_code_placeholder')
  }

  it('redirects to trips once the reset completes', async () => {
    jest.mocked(mockSignIn.attemptFirstFactor).mockResolvedValueOnce({
      status: 'complete',
      createdSessionId: 'sess_1',
    })

    await moveToResetStep()
    fireEvent.changeText(screen.getByPlaceholderText('verification_code_placeholder'), '123456')
    fireEvent.changeText(screen.getByPlaceholderText('password_placeholder'), 'Abcdef1!')
    fireEvent.press(screen.getByText('reset_password'))

    await waitFor(() => expect(mockSetActive).toHaveBeenCalledWith({ session: 'sess_1' }))
    expect(mockReplace).toHaveBeenCalledWith('/(app)/trips')
  })

  it('shows a generic error banner when the reset attempt throws', async () => {
    jest.mocked(mockSignIn.attemptFirstFactor).mockRejectedValueOnce(new Error('network error'))

    await moveToResetStep()
    fireEvent.changeText(screen.getByPlaceholderText('verification_code_placeholder'), '123456')
    fireEvent.changeText(screen.getByPlaceholderText('password_placeholder'), 'Abcdef1!')
    fireEvent.press(screen.getByText('reset_password'))

    expect(await screen.findByText('generic')).toBeTruthy()
  })
})
