import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { mockPush } from '@/test/navigation-mock'
import { ForgotPasswordForm } from './ForgotPasswordForm'

vi.mock('@clerk/nextjs', () => import('@/test/clerk-mock'))
vi.mock('@clerk/nextjs/errors', () => ({ isClerkAPIResponseError: () => false }))

describe('ForgotPasswordForm', () => {
  it('shows a validation error on an invalid email', async () => {
    const user = userEvent.setup()
    render(<ForgotPasswordForm />)
    await user.type(screen.getByLabelText('email_address_label'), 'not-an-email')
    await user.click(screen.getByRole('button', { name: 'send_reset_code' }))
    expect(await screen.findByText('invalid_email')).toBeInTheDocument()
  })

  it('stores the email and redirects to reset-password on success', async () => {
    const user = userEvent.setup()
    render(<ForgotPasswordForm />)
    await user.type(screen.getByLabelText('email_address_label'), 'user@example.com')
    await user.click(screen.getByRole('button', { name: 'send_reset_code' }))

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/reset-password'))
    expect(sessionStorage.getItem('reset-email')).toBe('user@example.com')
  })

  it('shows a generic error banner when the request throws', async () => {
    const { mockSignIn } = await import('@/test/clerk-mock')
    vi.mocked(mockSignIn.create).mockRejectedValueOnce(new Error('network error'))

    const user = userEvent.setup()
    render(<ForgotPasswordForm />)
    await user.type(screen.getByLabelText('email_address_label'), 'user@example.com')
    await user.click(screen.getByRole('button', { name: 'send_reset_code' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('generic')
  })
})
