import { fireEvent, render, screen } from '@testing-library/react-native'
import { ProfileForm } from './ProfileForm'

const mockMutateAsync = jest.fn()
jest.mock('@passe/hooks', () => ({
  useUpdateUser: () => ({ mutateAsync: mockMutateAsync, isPending: false }),
}))

const defaultProps = {
  displayName: 'Traveler',
  username: 'traveler',
  bio: null,
  email: 'user@example.com',
}

describe('ProfileForm', () => {
  it('pre-fills the form with the current profile', () => {
    render(<ProfileForm {...defaultProps} />)
    expect(screen.getByDisplayValue('Traveler')).toBeTruthy()
    expect(screen.getByDisplayValue('traveler')).toBeTruthy()
  })

  it('renders the email as read-only', () => {
    render(<ProfileForm {...defaultProps} />)
    expect(screen.getByDisplayValue('user@example.com').props.editable).toBe(false)
  })

  it('shows a success message on save', async () => {
    mockMutateAsync.mockResolvedValue({})
    render(<ProfileForm {...defaultProps} />)
    fireEvent.press(screen.getByText('save'))

    expect(await screen.findByText('success')).toBeTruthy()
  })

  it('shows an error message when the update fails', async () => {
    mockMutateAsync.mockRejectedValue(new Error('network down'))
    render(<ProfileForm {...defaultProps} />)
    fireEvent.press(screen.getByText('save'))

    expect(await screen.findByText('update_failed')).toBeTruthy()
  })
})
