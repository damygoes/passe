import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MapDataWrapper } from './MapDataWrapper'

const mockUseMapPoints = vi.fn()
const mockUseTrips = vi.fn()
vi.mock('@passe/hooks', () => ({
  useMapPoints: () => mockUseMapPoints(),
  useTrips: () => mockUseTrips(),
}))
vi.mock('./NoGeotaggedMemoriesEmpty', () => ({
  NoGeotaggedMemoriesEmpty: () => <div>no-points</div>,
}))

vi.mock('next/dynamic', () => ({
  default: () => (props: { points: { id: string }[]; visitedCountries: string[] }) => (
    <div data-testid="world-map">
      points:{props.points.map((point) => point.id).join(',')} countries:
      {props.visitedCountries.join(',')}
    </div>
  ),
}))

interface FixtureTrip {
  id: string
  countries: string[]
  startDate: string
}

interface FixturePoint {
  id: string
  tripId: string
  city?: string | null
}

function mockData(trips: FixtureTrip[] = [], points: FixturePoint[] = []) {
  mockUseTrips.mockReturnValue({ data: trips, isLoading: false, isError: false })
  mockUseMapPoints.mockReturnValue({ data: points, isLoading: false, isError: false })
}

describe('MapDataWrapper', () => {
  it('shows a skeleton while points are loading', () => {
    mockData()
    mockUseMapPoints.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    const { container } = render(<MapDataWrapper />)
    expect(container.querySelector('[data-slot="skeleton"]')).toBeInTheDocument()
  })

  it('shows a skeleton while trips are loading', () => {
    mockUseMapPoints.mockReturnValue({ data: [], isLoading: false, isError: false })
    mockUseTrips.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    const { container } = render(<MapDataWrapper />)
    expect(container.querySelector('[data-slot="skeleton"]')).toBeInTheDocument()
  })

  it('shows an error message when points fail to load', () => {
    mockData()
    mockUseMapPoints.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    render(<MapDataWrapper />)
    expect(screen.getByText('load_error')).toBeInTheDocument()
  })

  it('shows an error message when trips fail to load', () => {
    mockUseMapPoints.mockReturnValue({ data: [], isLoading: false, isError: false })
    mockUseTrips.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    render(<MapDataWrapper />)
    expect(screen.getByText('load_error')).toBeInTheDocument()
  })

  it('shows the empty state when there are no geotagged memories', () => {
    mockUseMapPoints.mockReturnValue({ data: [], isLoading: false, isError: false })
    mockData()
    render(<MapDataWrapper />)
    expect(screen.getByText('no-points')).toBeInTheDocument()
  })

  it('renders the title and the map with derived visited countries', () => {
    mockData(
      [
        { id: 't1', countries: ['Portugal'], startDate: '2026-01-01' },
        { id: 't2', countries: ['Japan', 'Vietnam'], startDate: '2025-06-01' },
      ],
      [
        { id: 'p1', tripId: 't1', city: 'Lisbon' },
        { id: 'p2', tripId: 't2', city: 'Tokyo' },
      ],
    )
    render(<MapDataWrapper />)
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText(/points:p1,p2/)).toBeInTheDocument()
    expect(screen.getByText(/countries:/)).toHaveTextContent('countries:Portugal,Japan,Vietnam')
  })

  it('renders the legend', () => {
    mockData(
      [{ id: 't1', countries: ['Portugal'], startDate: '2026-01-01' }],
      [{ id: 'p1', tripId: 't1', city: 'Lisbon' }],
    )
    render(<MapDataWrapper />)
    expect(screen.getByText('legend_visited')).toBeInTheDocument()
    expect(screen.getByText('legend_pins')).toBeInTheDocument()
    expect(screen.getByText('legend_not_yet')).toBeInTheDocument()
  })

  it('hides the year filter when trips only span one year', () => {
    mockData(
      [{ id: 't1', countries: ['Portugal'], startDate: '2026-01-01' }],
      [{ id: 'p1', tripId: 't1', city: 'Lisbon' }],
    )
    render(<MapDataWrapper />)
    expect(screen.queryByText('filter_all_years')).not.toBeInTheDocument()
  })

  it('filters points and visited countries by the selected year', () => {
    mockData(
      [
        { id: 't1', countries: ['Portugal'], startDate: '2026-01-01' },
        { id: 't2', countries: ['Japan'], startDate: '2025-06-01' },
      ],
      [
        { id: 'p1', tripId: 't1', city: 'Lisbon' },
        { id: 'p2', tripId: 't2', city: 'Tokyo' },
      ],
    )
    render(<MapDataWrapper />)

    expect(screen.getByText(/points:p1,p2/)).toBeInTheDocument()

    fireEvent.click(screen.getByText('2025'))

    expect(screen.getByText(/points:p2/)).toBeInTheDocument()
    expect(screen.getByText(/countries:/)).toHaveTextContent('countries:Japan')
  })
})
