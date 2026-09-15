import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TripsList } from '../lists/TripsList'

const mockUseTrips = vi.fn()
const mockUseAllMemories = vi.fn()
const mockUseUser = vi.fn()
vi.mock('@passe/hooks', () => ({
  useTrips: () => mockUseTrips(),
  useAllMemories: () => mockUseAllMemories(),
  useUser: () => mockUseUser(),
}))

vi.mock('../card/TripCard', () => ({
  TripCard: ({ trip, isShared }: { trip: { title: string }; isShared: boolean }) => (
    <div>
      {trip.title}:{isShared ? 'shared' : 'private'}
    </div>
  ),
}))
vi.mock('./TripsListSkeleton', () => ({ TripsListSkeleton: () => <div>loading-skeleton</div> }))
vi.mock('../empty/NoTripsEmpty', () => ({ NoTripsEmpty: () => <div>no-trips</div> }))

function setup({
  trips = [] as { id: string; title: string }[],
  memories = [] as { tripId: string; city?: string | null; isPublic?: boolean }[],
  user = { plan: 'free' } as { plan: 'free' | 'explorer' | 'collector' } | undefined,
} = {}) {
  mockUseTrips.mockReturnValue({ data: trips, isLoading: false, isError: false })
  mockUseAllMemories.mockReturnValue({ data: memories, isLoading: false, isError: false })
  mockUseUser.mockReturnValue({ data: user })
}

describe('TripsList', () => {
  it('shows a skeleton while loading', () => {
    mockUseTrips.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    mockUseAllMemories.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    mockUseUser.mockReturnValue({ data: undefined })
    render(<TripsList filter="all" />)
    expect(screen.getByText('loading-skeleton')).toBeInTheDocument()
  })

  it('shows an error message on error', () => {
    mockUseTrips.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    mockUseAllMemories.mockReturnValue({ data: undefined, isLoading: false, isError: false })
    mockUseUser.mockReturnValue({ data: undefined })
    render(<TripsList filter="all" />)
    expect(screen.getByText('trips_error')).toBeInTheDocument()
  })

  it('shows the empty state when there are no trips', () => {
    setup({ trips: [] })
    render(<TripsList filter="all" />)
    expect(screen.getByText('no-trips')).toBeInTheDocument()
  })

  it('renders a card per trip with its derived shared status', () => {
    setup({
      trips: [
        { id: '1', title: 'Japan' },
        { id: '2', title: 'France' },
      ],
      memories: [{ tripId: '1', city: 'Tokyo', isPublic: true }],
    })
    render(<TripsList filter="all" />)
    expect(screen.getByText('Japan:shared')).toBeInTheDocument()
    expect(screen.getByText('France:private')).toBeInTheDocument()
  })

  it('filters to private trips only', () => {
    setup({
      trips: [
        { id: '1', title: 'Japan' },
        { id: '2', title: 'France' },
      ],
      memories: [{ tripId: '1', city: 'Tokyo', isPublic: true }],
    })
    render(<TripsList filter="private" />)
    expect(screen.queryByText('Japan:shared')).not.toBeInTheDocument()
    expect(screen.getByText('France:private')).toBeInTheDocument()
  })

  it('filters to shared trips only', () => {
    setup({
      trips: [
        { id: '1', title: 'Japan' },
        { id: '2', title: 'France' },
      ],
      memories: [{ tripId: '1', city: 'Tokyo', isPublic: true }],
    })
    render(<TripsList filter="shared" />)
    expect(screen.getByText('Japan:shared')).toBeInTheDocument()
    expect(screen.queryByText('France:private')).not.toBeInTheDocument()
  })

  it('shows the quota meter for a limited plan', () => {
    setup({ trips: [{ id: '1', title: 'Japan' }], user: { plan: 'free' } })
    render(<TripsList filter="all" />)
    expect(screen.getByText('quota_cta')).toBeInTheDocument()
  })

  it('hides the quota meter for an unlimited plan', () => {
    setup({ trips: [{ id: '1', title: 'Japan' }], user: { plan: 'collector' } })
    render(<TripsList filter="all" />)
    expect(screen.queryByText('quota_cta')).not.toBeInTheDocument()
  })
})
