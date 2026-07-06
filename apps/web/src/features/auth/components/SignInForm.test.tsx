import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { mockPush } from '@/test/navigation-mock'
import { SignInForm } from './SignInForm'

vi.mock('@clerk/nextjs', () => import('@/test/clerk-mock'))
vi.mock('@clerk/nextjs/errors', () => ({ isClerkAPIResponseError: () => false }))

async function fillAndSubmit(email: string, password: string) {
  const user = userEvent.setup()
  render(<SignInForm />)
  if (email) await user.type(screen.getByLabelText('email_label'), email)
  if (password) await user.type(screen.getByLabelText('password_label'), password)
  await user.click(screen.getByRole('button', { name: 'sign_in' }))
  return user
}

describe('SignInForm', () => {
  it('renders email and password fields', () => {
    render(<SignInForm />)
    expect(screen.getByLabelText('email_label')).toBeInTheDocument()
    expect(screen.getByLabelText('password_label')).toBeInTheDocument()
  })

  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup()
    render(<SignInForm />)
    await user.click(screen.getByRole('button', { name: 'sign_in' }))
    expect(await screen.findByText('invalid_email')).toBeInTheDocument()
  })

  it('redirects to the dashboard on a complete sign-in', async () => {
    const { mockSignIn, mockSetActive } = await import('@/test/clerk-mock')
    vi.mocked(mockSignIn.create).mockResolvedValueOnce({
      status: 'complete',
      createdSessionId: 'sess_1',
    })

    await fillAndSubmit('user@example.com', 'password123')

    await waitFor(() => expect(mockSetActive).toHaveBeenCalledWith({ session: 'sess_1' }))
    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })

  it('moves to the OTP step when a second factor is required', async () => {
    const { mockSignIn } = await import('@/test/clerk-mock')
    vi.mocked(mockSignIn.create).mockResolvedValueOnce({ status: 'needs_second_factor' })

    await fillAndSubmit('user@example.com', 'password123')

    expect(await screen.findByLabelText('verification_code_label')).toBeInTheDocument()
  })

  it('shows a generic error banner when sign-in throws', async () => {
    const { mockSignIn } = await import('@/test/clerk-mock')
    vi.mocked(mockSignIn.create).mockRejectedValueOnce(new Error('network error'))

    await fillAndSubmit('user@example.com', 'password123')

    expect(await screen.findByRole('alert')).toHaveTextContent('generic')
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    render(<SignInForm />)
    const passwordInput = screen.getByLabelText('password_label')
    expect(passwordInput).toHaveAttribute('type', 'password')

    const toggle = screen.getByRole('button', { name: 'input action' })
    await user.click(toggle)
    expect(passwordInput).toHaveAttribute('type', 'text')
  })
})
