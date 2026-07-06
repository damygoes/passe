import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { mockPush } from '@/test/navigation-mock'
import { SignUpForm } from './SignUpForm'

vi.mock('@clerk/nextjs', () => import('@/test/clerk-mock'))
vi.mock('@clerk/nextjs/errors', () => ({ isClerkAPIResponseError: () => false }))

async function fillDetails(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('display_name_label'), 'Traveler')
  await user.type(screen.getByLabelText('email_label'), 'user@example.com')
  await user.type(screen.getByLabelText('password_label'), 'Abcdef1!')
  await user.type(screen.getByLabelText('confirm_password_label'), 'Abcdef1!')
}

describe('SignUpForm', () => {
  it('renders all detail fields', () => {
    render(<SignUpForm />)
    expect(screen.getByLabelText('display_name_label')).toBeInTheDocument()
    expect(screen.getByLabelText('email_label')).toBeInTheDocument()
    expect(screen.getByLabelText('password_label')).toBeInTheDocument()
    expect(screen.getByLabelText('confirm_password_label')).toBeInTheDocument()
  })

  it('shows a mismatch error when passwords differ', async () => {
    const user = userEvent.setup()
    render(<SignUpForm />)
    await user.type(screen.getByLabelText('password_label'), 'Abcdef1!')
    await user.type(screen.getByLabelText('confirm_password_label'), 'different')
    expect(await screen.findByText('no_match')).toBeInTheDocument()
  })

  it('moves to the OTP step after successful details submission', async () => {
    const user = userEvent.setup()
    render(<SignUpForm />)
    await fillDetails(user)
    await user.click(screen.getByRole('button', { name: 'create_account' }))

    expect(await screen.findByLabelText('verification_code_label')).toBeInTheDocument()
  })

  it('redirects to the dashboard once OTP verification completes', async () => {
    const { mockSignUp, mockSetActive } = await import('@/test/clerk-mock')
    vi.mocked(mockSignUp.attemptEmailAddressVerification).mockResolvedValueOnce({
      status: 'complete',
      createdSessionId: 'sess_1',
    })

    const user = userEvent.setup()
    render(<SignUpForm />)
    await fillDetails(user)
    await user.click(screen.getByRole('button', { name: 'create_account' }))

    const otpInput = await screen.findByLabelText('verification_code_label')
    await user.type(otpInput, '123456')
    await user.click(screen.getByRole('button', { name: 'verify_email' }))

    await waitFor(() => expect(mockSetActive).toHaveBeenCalledWith({ session: 'sess_1' }))
    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })

  it('shows a generic error banner when sign-up creation throws', async () => {
    const { mockSignUp } = await import('@/test/clerk-mock')
    vi.mocked(mockSignUp.create).mockRejectedValueOnce(new Error('network error'))

    const user = userEvent.setup()
    render(<SignUpForm />)
    await fillDetails(user)
    await user.click(screen.getByRole('button', { name: 'create_account' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('generic')
  })
})
