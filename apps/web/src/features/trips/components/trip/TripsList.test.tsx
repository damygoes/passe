import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TripsList } from './TripsList'

const mockUseTrips = vi.fn()
vi.mock('@passe/hooks', () => ({ useTrips: () => mockUseTrips() }))

vi.mock('./TripCard', () => ({ TripCard: ({ trip }: { trip: { title: string } }) => <div>{trip.title}</div> }))
vi.mock('./TripsListSkeleton', () => ({ TripsListSkeleton: () => <div>loading-skeleton</div> }))
vi.mock('./NoTripsEmpty', () => ({ NoTripsEmpty: () => <div>no-trips</div> }))

describe('TripsList', () => {
  it('shows a skeleton while loading', () => {
    mockUseTrips.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    render(<TripsList />)
    expect(screen.getByText('loading-skeleton')).toBeInTheDocument()
  })

  it('shows an error message on error', () => {
    mockUseTrips.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    render(<TripsList />)
    expect(screen.getByText('trips_error')).toBeInTheDocument()
  })

  it('shows the empty state when there are no trips', () => {
    mockUseTrips.mockReturnValue({ data: [], isLoading: false, isError: false })
    render(<TripsList />)
    expect(screen.getByText('no-trips')).toBeInTheDocument()
  })

  it('renders a card per trip', () => {
    mockUseTrips.mockReturnValue({
      data: [{ id: '1', title: 'Japan' }, { id: '2', title: 'France' }],
      isLoading: false,
      isError: false,
    })
    render(<TripsList />)
    expect(screen.getByText('Japan')).toBeInTheDocument()
    expect(screen.getByText('France')).toBeInTheDocument()
  })
})
