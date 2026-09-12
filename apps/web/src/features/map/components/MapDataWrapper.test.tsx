import { render, screen } from '@testing-library/react'
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
  default: () => (props: { points: unknown[]; visitedCountries: string[] }) => (
    <div data-testid="world-map">
      points:{props.points.length} countries:{props.visitedCountries.join(',')}
    </div>
  ),
}))

function mockTrips(countries: string[][] = []) {
  mockUseTrips.mockReturnValue({
    data: countries.map((tripCountries, index) => ({
      id: String(index),
      countries: tripCountries,
    })),
    isLoading: false,
    isError: false,
  })
}

describe('MapDataWrapper', () => {
  it('shows a skeleton while points are loading', () => {
    mockUseMapPoints.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    mockTrips()
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
    mockUseMapPoints.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    mockTrips()
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
    mockTrips()
    render(<MapDataWrapper />)
    expect(screen.getByText('no-points')).toBeInTheDocument()
  })

  it('renders the map with the fetched points and derived visited countries', () => {
    mockUseMapPoints.mockReturnValue({
      data: [{ id: '1' }, { id: '2' }],
      isLoading: false,
      isError: false,
    })
    mockTrips([['Portugal'], ['Japan', 'Vietnam']])
    render(<MapDataWrapper />)
    expect(screen.getByText(/points:2/)).toBeInTheDocument()
    expect(screen.getByText(/countries:/)).toHaveTextContent('countries:Portugal,Japan,Vietnam')
  })
})
