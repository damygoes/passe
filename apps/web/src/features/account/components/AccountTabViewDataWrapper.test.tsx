import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AccountTabViewDataWrapper } from './AccountTabViewDataWrapper'

vi.mock('@clerk/nextjs', () => ({
  useUser: () => ({ user: { primaryEmailAddress: { emailAddress: 'user@example.com' } } }),
}))

const mockUseUser = vi.fn()
vi.mock('@passe/hooks', () => ({ useUser: () => mockUseUser() }))

vi.mock('../components/AccountViewSkeleton', () => ({ AccountViewSkeleton: () => <div>loading</div> }))
vi.mock('../components/AccountViewError', () => ({ AccountViewError: () => <div>error</div> }))
vi.mock('../components/ProfileForm', () => ({ ProfileForm: () => <div>profile-form</div> }))
vi.mock('../components/PasswordForm', () => ({ PasswordForm: () => <div>password-form</div> }))
vi.mock('../components/DangerZone', () => ({ DangerZone: () => <div>danger-zone</div> }))

describe('AccountTabViewDataWrapper', () => {
  it('shows a skeleton while loading', () => {
    mockUseUser.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    render(<AccountTabViewDataWrapper activeTab="profile" />)
    expect(screen.getByText('loading')).toBeInTheDocument()
  })

  it('shows an error state on error', () => {
    mockUseUser.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    render(<AccountTabViewDataWrapper activeTab="profile" />)
    expect(screen.getByText('error')).toBeInTheDocument()
  })

  it('renders the profile tab', () => {
    mockUseUser.mockReturnValue({
      data: { displayName: 'Traveler', username: 'traveler', bio: null },
      isLoading: false,
      isError: false,
    })
    render(<AccountTabViewDataWrapper activeTab="profile" />)
    expect(screen.getByText('profile-form')).toBeInTheDocument()
  })

  it('renders the security tab', () => {
    mockUseUser.mockReturnValue({
      data: { displayName: 'Traveler', username: 'traveler', bio: null },
      isLoading: false,
      isError: false,
    })
    render(<AccountTabViewDataWrapper activeTab="security" />)
    expect(screen.getByText('password-form')).toBeInTheDocument()
  })

  it('renders the danger tab', () => {
    mockUseUser.mockReturnValue({
      data: { displayName: 'Traveler', username: 'traveler', bio: null },
      isLoading: false,
      isError: false,
    })
    render(<AccountTabViewDataWrapper activeTab="danger" />)
    expect(screen.getByText('danger-zone')).toBeInTheDocument()
  })
})
