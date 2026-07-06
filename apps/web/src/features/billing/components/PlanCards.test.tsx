import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PlanCards } from './PlanCards'

const mockCheckoutMutate = vi.fn()
const mockPortalMutate = vi.fn()
let checkoutState = { isPending: false, isError: false }
let portalState = { isPending: false, isError: false }

vi.mock('@passe/hooks', () => ({
  useCreateCheckoutSession: () => ({ mutate: mockCheckoutMutate, ...checkoutState }),
  useCreatePortalSession: () => ({ mutate: mockPortalMutate, ...portalState }),
}))

beforeEach(() => {
  checkoutState = { isPending: false, isError: false }
  portalState = { isPending: false, isError: false }
})

describe('PlanCards', () => {
  it('disables the current plan’s button', () => {
    render(<PlanCards currentPlan="explorer" />)
    expect(screen.getByRole('button', { name: 'current_plan' })).toBeDisabled()
  })

  it('shows upgrade buttons for a free-plan user', async () => {
    const user = userEvent.setup()
    render(<PlanCards currentPlan="free" />)

    const upgradeButtons = screen.getAllByText(/upgrade_to/)
    expect(upgradeButtons.length).toBeGreaterThan(0)

    await user.click(upgradeButtons[0]!)
    expect(mockCheckoutMutate).toHaveBeenCalledWith('explorer', expect.any(Object))
  })

  it('shows switch buttons (not upgrade) for a paid-plan user viewing another paid plan', () => {
    render(<PlanCards currentPlan="explorer" />)
    expect(screen.getByText(/switch_to/)).toBeInTheDocument()
    expect(screen.queryByText(/upgrade_to/)).not.toBeInTheDocument()
  })

  it('shows a manage-subscription button for paid-plan users', async () => {
    const user = userEvent.setup()
    render(<PlanCards currentPlan="collector" />)
    await user.click(screen.getByRole('button', { name: 'manage_subscription' }))
    expect(mockPortalMutate).toHaveBeenCalled()
  })

  it('shows an error message when a mutation errors', () => {
    checkoutState = { isPending: false, isError: true }
    render(<PlanCards currentPlan="free" />)
    expect(screen.getByRole('alert')).toHaveTextContent('action_error')
  })
})
