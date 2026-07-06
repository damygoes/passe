import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { BillingDataWrapper } from './BillingDataWrapper'

const mockUseUser = vi.fn()
vi.mock('@passe/hooks', () => ({ useUser: () => mockUseUser() }))
vi.mock('./BillingViewSkeleton', () => ({ BillingViewSkeleton: () => <div>loading</div> }))
vi.mock('./PlanCards', () => ({ PlanCards: ({ currentPlan }: { currentPlan: string }) => <div>plan:{currentPlan}</div> }))

describe('BillingDataWrapper', () => {
  it('shows a skeleton while loading', () => {
    mockUseUser.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    render(<BillingDataWrapper />)
    expect(screen.getByText('loading')).toBeInTheDocument()
  })

  it('shows an error message on error', () => {
    mockUseUser.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    render(<BillingDataWrapper />)
    expect(screen.getByText('load_error')).toBeInTheDocument()
  })

  it('renders PlanCards with the user’s current plan', () => {
    mockUseUser.mockReturnValue({ data: { plan: 'explorer' }, isLoading: false, isError: false })
    render(<BillingDataWrapper />)
    expect(screen.getByText('plan:explorer')).toBeInTheDocument()
  })
})
