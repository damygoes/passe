import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockPush } from '@/test/navigation-mock'
import { ResetPasswordForm } from './ResetPasswordForm'

vi.mock('@clerk/nextjs', () => import('@/test/clerk-mock'))
vi.mock('@clerk/nextjs/errors', () => ({ isClerkAPIResponseError: () => false }))

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('reset_code_label'), '123456')
  await user.type(screen.getByLabelText('new_password_label'), 'Abcdef1!')
  await user.click(screen.getByRole('button', { name: 'reset_password' }))
}

beforeEach(() => {
  sessionStorage.setItem('reset-email', 'user@example.com')
})

afterEach(() => {
  sessionStorage.clear()
})

describe('ResetPasswordForm', () => {
  it('shows the email the reset code was sent to', async () => {
    render(<ResetPasswordForm />)
    expect(await screen.findByText('code_sent_to')).toBeInTheDocument()
  })

  it('redirects to the dashboard and clears the stored email on success', async () => {
    const { mockSignIn, mockSetActive } = await import('@/test/clerk-mock')
    vi.mocked(mockSignIn.attemptFirstFactor).mockResolvedValueOnce({
      status: 'complete',
      createdSessionId: 'sess_1',
    })

    const user = userEvent.setup()
    render(<ResetPasswordForm />)
    await fillAndSubmit(user)

    await waitFor(() => expect(mockSetActive).toHaveBeenCalledWith({ session: 'sess_1' }))
    expect(mockPush).toHaveBeenCalledWith('/dashboard')
    expect(sessionStorage.getItem('reset-email')).toBeNull()
  })

  it('shows a generic error banner when the reset attempt throws', async () => {
    const { mockSignIn } = await import('@/test/clerk-mock')
    vi.mocked(mockSignIn.attemptFirstFactor).mockRejectedValueOnce(new Error('network error'))

    const user = userEvent.setup()
    render(<ResetPasswordForm />)
    await fillAndSubmit(user)

    expect(await screen.findByRole('alert')).toHaveTextContent('generic')
  })
})
