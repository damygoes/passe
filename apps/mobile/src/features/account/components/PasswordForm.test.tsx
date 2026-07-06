import { isClerkAPIResponseError } from '@clerk/expo'
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import { TextInput } from 'react-native'
import { mockUser } from '@/test/clerk-expo-mock'
import { PasswordForm } from './PasswordForm'

beforeEach(() => {
  jest.mocked(isClerkAPIResponseError).mockReturnValue(false)
})

function getPasswordInputs() {
  return screen.UNSAFE_getAllByType(TextInput)
}

function fillPasswordFields(newPassword = 'Abcdef1!', confirmPassword = newPassword) {
  const [currentPassword, newPasswordInput, confirmPasswordInput] = getPasswordInputs()
  fireEvent.changeText(currentPassword!, 'oldpassword')
  fireEvent.changeText(newPasswordInput!, newPassword)
  fireEvent.changeText(confirmPasswordInput!, confirmPassword)
}

describe('PasswordForm', () => {
  it('shows a live mismatch indicator before submitting', () => {
    render(<PasswordForm />)
    const [, newPasswordInput, confirmPasswordInput] = getPasswordInputs()
    fireEvent.changeText(newPasswordInput!, 'Abcdef1!')
    fireEvent.changeText(confirmPasswordInput!, 'different')
    expect(screen.getByText('no_match')).toBeTruthy()
  })

  it('updates the password and shows a success message on the happy path', async () => {
    render(<PasswordForm />)
    fillPasswordFields()
    fireEvent.press(screen.getByText('update'))

    await waitFor(() => expect(mockUser.updatePassword).toHaveBeenCalled())
    expect(await screen.findByText('success')).toBeTruthy()
  })

  it('moves to the OTP step when reverification is required', async () => {
    jest.mocked(mockUser.updatePassword).mockRejectedValueOnce({
      errors: [{ code: 'session_reverification_required' }],
    })
    jest.mocked(isClerkAPIResponseError).mockReturnValue(true)

    render(<PasswordForm />)
    fillPasswordFields()
    fireEvent.press(screen.getByText('update'))

    expect(await screen.findByPlaceholderText('verification_code_placeholder')).toBeTruthy()
  })

  it('shows a generic error banner when the update fails for another reason', async () => {
    jest.mocked(mockUser.updatePassword).mockRejectedValueOnce(new Error('network down'))

    render(<PasswordForm />)
    fillPasswordFields()
    fireEvent.press(screen.getByText('update'))

    expect(await screen.findByText('password_failed')).toBeTruthy()
  })
})
