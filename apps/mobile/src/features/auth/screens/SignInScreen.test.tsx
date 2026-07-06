import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import { mockPush, mockReplace } from '@/test/expo-router-mock'
import { mockSetActive, mockSignIn } from '@/test/clerk-expo-mock'
import { SignInScreen } from './SignInScreen'

async function fillAndSubmit(email: string, password: string) {
  render(<SignInScreen />)
  fireEvent.changeText(screen.getByPlaceholderText('email_placeholder'), email)
  fireEvent.changeText(screen.getByPlaceholderText('password_placeholder'), password)
  fireEvent.press(screen.getByText('sign_in'))
}

describe('SignInScreen', () => {
  it('renders email and password fields', () => {
    render(<SignInScreen />)
    expect(screen.getByPlaceholderText('email_placeholder')).toBeTruthy()
    expect(screen.getByPlaceholderText('password_placeholder')).toBeTruthy()
  })

  it('shows a validation error on empty submit', async () => {
    render(<SignInScreen />)
    fireEvent.press(screen.getByText('sign_in'))
    expect(await screen.findAllByText('Required')).not.toHaveLength(0)
  })

  it('shows a custom validation error for a malformed email', async () => {
    render(<SignInScreen />)
    fireEvent.changeText(screen.getByPlaceholderText('email_placeholder'), 'not-an-email')
    fireEvent.press(screen.getByText('sign_in'))
    expect(await screen.findByText('invalid_email')).toBeTruthy()
  })

  it('redirects to trips on a complete sign-in', async () => {
    jest.mocked(mockSignIn.create).mockResolvedValueOnce({
      status: 'complete',
      createdSessionId: 'sess_1',
    })

    await fillAndSubmit('user@example.com', 'password123')

    await waitFor(() => expect(mockSetActive).toHaveBeenCalledWith({ session: 'sess_1' }))
    expect(mockReplace).toHaveBeenCalledWith('/(app)/trips')
  })

  it('moves to the OTP step when a second factor is required', async () => {
    jest.mocked(mockSignIn.create).mockResolvedValueOnce({ status: 'needs_second_factor' })

    await fillAndSubmit('user@example.com', 'password123')

    expect(await screen.findByPlaceholderText('verification_code_placeholder')).toBeTruthy()
  })

  it('shows a generic error banner when sign-in throws', async () => {
    jest.mocked(mockSignIn.create).mockRejectedValueOnce(new Error('network error'))

    await fillAndSubmit('user@example.com', 'password123')

    expect(await screen.findByText('generic')).toBeTruthy()
  })

  it('navigates to sign-up via the footer link', () => {
    render(<SignInScreen />)
    fireEvent.press(screen.getByText('sign_up_link'))
    expect(mockPush).toHaveBeenCalledWith('/(auth)/sign-up')
  })
})
