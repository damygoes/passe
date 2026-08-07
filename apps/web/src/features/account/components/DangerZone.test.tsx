import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockPush } from '@/test/navigation-mock'
import { DangerZone } from './DangerZone'

vi.mock('@clerk/nextjs', () => import('@/test/clerk-mock'))

const mockDeleteAccount = vi.fn()
let mockUserData: { planSource?: string | null } | undefined = undefined
vi.mock('@passe/hooks', () => ({
  useDeleteAccount: () => ({ mutateAsync: mockDeleteAccount, isPending: false }),
  useUser: () => ({ data: mockUserData }),
}))

async function openDialog(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'delete' }))
}

describe('DangerZone', () => {
  beforeEach(() => {
    mockUserData = undefined
  })

  it('keeps the confirm action disabled until the exact phrase is typed', async () => {
    const user = userEvent.setup()
    render(<DangerZone />)
    await openDialog(user)

    const confirmButtons = screen.getAllByRole('button', { name: 'delete' })
    const confirmAction = confirmButtons[confirmButtons.length - 1]!
    expect(confirmAction).toBeDisabled()

    await user.type(screen.getByLabelText('confirm_label'), 'delete my account')
    expect(confirmAction).not.toBeDisabled()
  })

  it('deletes the account and redirects to sign-in on confirm', async () => {
    mockDeleteAccount.mockResolvedValue({})
    const user = userEvent.setup()
    render(<DangerZone />)
    await openDialog(user)

    await user.type(screen.getByLabelText('confirm_label'), 'delete my account')
    const confirmButtons = screen.getAllByRole('button', { name: 'delete' })
    await user.click(confirmButtons[confirmButtons.length - 1]!)

    await waitFor(() => expect(mockDeleteAccount).toHaveBeenCalled())
    expect(mockPush).toHaveBeenCalledWith('/sign-in')
  })

  it('shows an error message when deletion fails', async () => {
    mockDeleteAccount.mockRejectedValue(new Error('delete failed'))
    const user = userEvent.setup()
    render(<DangerZone />)
    await openDialog(user)

    await user.type(screen.getByLabelText('confirm_label'), 'delete my account')
    const confirmButtons = screen.getAllByRole('button', { name: 'delete' })
    await user.click(confirmButtons[confirmButtons.length - 1]!)

    expect(await screen.findByText('delete failed')).toBeInTheDocument()
  })

  it('shows the IAP cancellation warning only for RevenueCat-sourced subscribers', async () => {
    mockUserData = { planSource: 'revenuecat' }
    const user = userEvent.setup()
    render(<DangerZone />)
    await openDialog(user)

    expect(screen.getByText('iap_cancel_warning')).toBeInTheDocument()
  })

  it('does not show the IAP cancellation warning for Stripe-sourced subscribers', async () => {
    mockUserData = { planSource: 'stripe' }
    const user = userEvent.setup()
    render(<DangerZone />)
    await openDialog(user)

    expect(screen.queryByText('iap_cancel_warning')).not.toBeInTheDocument()
  })
})
