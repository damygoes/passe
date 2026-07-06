import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MapDataWrapper } from './MapDataWrapper'

const mockUseMapPoints = vi.fn()
vi.mock('@passe/hooks', () => ({ useMapPoints: () => mockUseMapPoints() }))
vi.mock('./NoGeotaggedMemoriesEmpty', () => ({ NoGeotaggedMemoriesEmpty: () => <div>no-points</div> }))

vi.mock('next/dynamic', () => ({
  default: () => (props: { points: unknown[] }) => (
    <div data-testid="world-map">points:{props.points.length}</div>
  ),
}))

describe('MapDataWrapper', () => {
  it('shows a skeleton while loading', () => {
    mockUseMapPoints.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    const { container } = render(<MapDataWrapper />)
    expect(container.querySelector('[data-slot="skeleton"]')).toBeInTheDocument()
  })

  it('shows an error message on error', () => {
    mockUseMapPoints.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    render(<MapDataWrapper />)
    expect(screen.getByText('load_error')).toBeInTheDocument()
  })

  it('shows the empty state when there are no geotagged memories', () => {
    mockUseMapPoints.mockReturnValue({ data: [], isLoading: false, isError: false })
    render(<MapDataWrapper />)
    expect(screen.getByText('no-points')).toBeInTheDocument()
  })

  it('renders the map with the fetched points', () => {
    mockUseMapPoints.mockReturnValue({ data: [{ id: '1' }, { id: '2' }], isLoading: false, isError: false })
    render(<MapDataWrapper />)
    expect(screen.getByText('points:2')).toBeInTheDocument()
  })
})
