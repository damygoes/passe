import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ProfileForm } from './ProfileForm'

const mockRefresh = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: mockRefresh }) }))

const mockMutateAsync = vi.fn()
vi.mock('@passe/hooks', () => ({
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
    expect(screen.getByLabelText('display_name_label')).toHaveValue('Traveler')
    expect(screen.getByLabelText('username_label')).toHaveValue('traveler')
  })

  it('renders the email as read-only', () => {
    render(<ProfileForm {...defaultProps} />)
    expect(screen.getByDisplayValue('user@example.com')).toBeDisabled()
  })

  it('shows a success message and refreshes the router on save', async () => {
    mockMutateAsync.mockResolvedValue({})
    const user = userEvent.setup()
    render(<ProfileForm {...defaultProps} />)
    await user.click(screen.getByRole('button', { name: 'save' }))

    await waitFor(() => expect(screen.getByText('success')).toBeInTheDocument())
    expect(mockRefresh).toHaveBeenCalled()
  })

  it('shows an error message when the update fails', async () => {
    mockMutateAsync.mockRejectedValue(new Error('network down'))
    const user = userEvent.setup()
    render(<ProfileForm {...defaultProps} />)
    await user.click(screen.getByRole('button', { name: 'save' }))

    expect(await screen.findByText('update_failed')).toBeInTheDocument()
  })
})
