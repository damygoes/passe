import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SocialAuthButtons } from './SocialAuthButtons'

vi.mock('@clerk/nextjs', () => import('@/test/clerk-mock'))
vi.mock('@clerk/nextjs/errors', () => ({ isClerkAPIResponseError: () => false }))

describe('SocialAuthButtons', () => {
  it('renders a Google and an Apple button', () => {
    render(<SocialAuthButtons mode="sign-in" />)
    expect(screen.getByRole('button', { name: /google/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /apple/ })).toBeInTheDocument()
  })

  it('starts the Google OAuth redirect on click', async () => {
    const { mockSignIn } = await import('@/test/clerk-mock')
    const user = userEvent.setup()
    render(<SocialAuthButtons mode="sign-in" />)

    await user.click(screen.getByRole('button', { name: /google/ }))

    await waitFor(() =>
      expect(mockSignIn.authenticateWithRedirect).toHaveBeenCalledWith(
        expect.objectContaining({ strategy: 'oauth_google' }),
      ),
    )
  })

  it('starts the Apple OAuth redirect on click', async () => {
    const { mockSignIn } = await import('@/test/clerk-mock')
    const user = userEvent.setup()
    render(<SocialAuthButtons mode="sign-in" />)

    await user.click(screen.getByRole('button', { name: /apple/ }))

    await waitFor(() =>
      expect(mockSignIn.authenticateWithRedirect).toHaveBeenCalledWith(
        expect.objectContaining({ strategy: 'oauth_apple' }),
      ),
    )
  })
})
