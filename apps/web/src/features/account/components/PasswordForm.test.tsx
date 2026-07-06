import { isClerkAPIResponseError } from '@clerk/nextjs/errors'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PasswordForm } from './PasswordForm'

vi.mock('@clerk/nextjs', () => import('@/test/clerk-mock'))
vi.mock('@clerk/nextjs/errors', () => ({ isClerkAPIResponseError: vi.fn() }))

beforeEach(() => {
  vi.mocked(isClerkAPIResponseError).mockReturnValue(false)
})

async function fillForm(user: ReturnType<typeof userEvent.setup>, newPassword = 'Abcdef1!') {
  await user.type(screen.getByLabelText('current_password_label'), 'oldpassword')
  await user.type(screen.getByLabelText('new_password_label'), newPassword)
  await user.type(screen.getByLabelText('confirm_password_label'), newPassword)
}

describe('PasswordForm', () => {
  it('shows a live mismatch indicator before submitting', async () => {
    const user = userEvent.setup()
    render(<PasswordForm />)
    await user.type(screen.getByLabelText('new_password_label'), 'Abcdef1!')
    await user.type(screen.getByLabelText('confirm_password_label'), 'different')
    expect(await screen.findByText('no_match')).toBeInTheDocument()
  })

  it('updates the password and shows a success message on the happy path', async () => {
    const { mockUser } = await import('@/test/clerk-mock')
    const user = userEvent.setup()
    render(<PasswordForm />)
    await fillForm(user)
    await user.click(screen.getByRole('button', { name: 'update' }))

    await waitFor(() => expect(mockUser.updatePassword).toHaveBeenCalled())
    expect(await screen.findByText('success')).toBeInTheDocument()
  })

  it('moves to the OTP step when reverification is required', async () => {
    const { mockUser } = await import('@/test/clerk-mock')
    vi.mocked(mockUser.updatePassword).mockRejectedValueOnce({
      errors: [{ code: 'session_reverification_required' }],
    })
    vi.mocked(isClerkAPIResponseError).mockReturnValue(true)

    const user = userEvent.setup()
    render(<PasswordForm />)
    await fillForm(user)
    await user.click(screen.getByRole('button', { name: 'update' }))

    expect(await screen.findByLabelText('verification_code_label')).toBeInTheDocument()
  })

  it('shows a generic error banner when the update fails for another reason', async () => {
    const { mockUser } = await import('@/test/clerk-mock')
    vi.mocked(mockUser.updatePassword).mockRejectedValueOnce(new Error('network down'))

    const user = userEvent.setup()
    render(<PasswordForm />)
    await fillForm(user)
    await user.click(screen.getByRole('button', { name: 'update' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('password_failed')
  })
})
