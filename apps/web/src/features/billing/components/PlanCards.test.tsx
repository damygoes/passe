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

// Same idiom as BillingStatusBanner.test — PlanCards reads ?reason= to pick which
// plan to feature, and there's no router context outside a Next server/build.
const mockSearchParams = vi.fn(() => new URLSearchParams())
vi.mock('next/navigation', () => ({ useSearchParams: () => mockSearchParams() }))

beforeEach(() => {
  checkoutState = { isPending: false, isError: false }
  portalState = { isPending: false, isError: false }
  mockSearchParams.mockReturnValue(new URLSearchParams())
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

  it('shows a device-settings hint instead of portal buttons for RevenueCat subscribers', () => {
    render(<PlanCards currentPlan="collector" planSource="revenuecat" />)
    expect(screen.getByText('managed_on_mobile')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'manage_subscription' })).not.toBeInTheDocument()
    expect(screen.queryByText(/switch_to/)).not.toBeInTheDocument()
  })

  // Upgrade CTAs tag /billing with the feature that blocked the user. Explorer has
  // pdfExport: false, so the generic "recommended" highlight would sell the wrong
  // tier to someone blocked on a keepsake.
  describe('when tagged with the feature that blocked the user', () => {
    it('badges collector for a keepsake, instead of recommending explorer', () => {
      mockSearchParams.mockReturnValue(new URLSearchParams('reason=postcard'))
      render(<PlanCards currentPlan="free" />)

      expect(screen.getByText('unlocks.postcard')).toBeInTheDocument()
      expect(screen.queryByText('recommended')).not.toBeInTheDocument()
    })

    it('badges explorer for a limit explorer actually raises', () => {
      mockSearchParams.mockReturnValue(new URLSearchParams('reason=trips'))
      render(<PlanCards currentPlan="free" />)

      expect(screen.getByText('unlocks.trips')).toBeInTheDocument()
      expect(screen.queryByText('recommended')).not.toBeInTheDocument()
    })

    it('ignores an unrecognised reason rather than trusting the param', () => {
      mockSearchParams.mockReturnValue(new URLSearchParams('reason=toString'))
      render(<PlanCards currentPlan="free" />)

      expect(screen.getByText('recommended')).toBeInTheDocument()
    })

    it('drops the contextual badge for a plan that already unlocks the feature', () => {
      mockSearchParams.mockReturnValue(new URLSearchParams('reason=postcard'))
      render(<PlanCards currentPlan="collector" />)

      expect(screen.queryByText('unlocks.postcard')).not.toBeInTheDocument()
      // Renders twice for the current plan: the badge and the disabled button label.
      expect(screen.getAllByText('current_plan').length).toBeGreaterThan(0)
    })
  })

  it('recommends explorer on an untagged visit', () => {
    render(<PlanCards currentPlan="free" />)
    expect(screen.getByText('recommended')).toBeInTheDocument()
  })

  it('lets the current-plan badge win over the recommendation', () => {
    render(<PlanCards currentPlan="explorer" />)
    expect(screen.queryByText('recommended')).not.toBeInTheDocument()
  })
})
