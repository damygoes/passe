import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { BillingStatusBanner } from './BillingStatusBanner'

const mockSearchParams = vi.fn()
vi.mock('next/navigation', () => ({ useSearchParams: () => mockSearchParams() }))

describe('BillingStatusBanner', () => {
  it('shows a success banner when success=true', () => {
    mockSearchParams.mockReturnValue(new URLSearchParams('success=true'))
    render(<BillingStatusBanner />)
    expect(screen.getByRole('status')).toHaveTextContent('success_banner')
  })

  it('shows a canceled banner when canceled=true', () => {
    mockSearchParams.mockReturnValue(new URLSearchParams('canceled=true'))
    render(<BillingStatusBanner />)
    expect(screen.getByRole('status')).toHaveTextContent('canceled_banner')
  })

  it('renders nothing without a status param', () => {
    mockSearchParams.mockReturnValue(new URLSearchParams(''))
    const { container } = render(<BillingStatusBanner />)
    expect(container).toBeEmptyDOMElement()
  })
})
