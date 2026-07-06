import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PortfolioGrid } from './PortfolioGrid'

vi.mock('./NoPublicTripsEmpty', () => ({
  NoPublicTripsEmpty: ({ displayName }: { displayName: string }) => <div>empty:{displayName}</div>,
}))
vi.mock('./PortfolioTripCard', () => ({
  PortfolioTripCard: ({ trip }: { trip: { title: string } }) => <div>{trip.title}</div>,
}))

describe('PortfolioGrid', () => {
  it('shows the empty state when there are no public trips', () => {
    render(<PortfolioGrid slug="alice" displayName="Alice" trips={[]} />)
    expect(screen.getByText('empty:Alice')).toBeInTheDocument()
  })

  it('renders a card per trip', () => {
    render(
      <PortfolioGrid
        slug="alice"
        displayName="Alice"
        trips={[
          { id: '1', title: 'Japan', startDate: '2024-01-01', endDate: '2024-01-05', countries: ['JP'] },
          { id: '2', title: 'France', startDate: '2024-02-01', endDate: '2024-02-05', countries: ['FR'] },
        ]}
      />,
    )
    expect(screen.getByText('Japan')).toBeInTheDocument()
    expect(screen.getByText('France')).toBeInTheDocument()
  })
})
