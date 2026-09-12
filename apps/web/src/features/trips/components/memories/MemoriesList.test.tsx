import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoriesList } from './MemoriesList'

const mockUseMemories = vi.fn()
vi.mock('@passe/hooks', () => ({ useMemories: () => mockUseMemories() }))

vi.mock('./MemoriesListSkeleton', () => ({
  MemoriesListSkeleton: () => <div>loading-skeleton</div>,
}))
vi.mock('./NoMemoriesEmpty', () => ({ NoMemoriesEmpty: () => <div>no-memories</div> }))
vi.mock('./MemoriesMasonryGrid', () => ({
  MemoriesMasonryGrid: ({ memories }: { memories: unknown[] }) => (
    <div>memories:{memories.length}</div>
  ),
}))

describe('MemoriesList', () => {
  it('shows a skeleton while loading', () => {
    mockUseMemories.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    render(<MemoriesList tripId="trip-1" />)
    expect(screen.getByText('loading-skeleton')).toBeInTheDocument()
  })

  it('shows an error message on error', () => {
    mockUseMemories.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    render(<MemoriesList tripId="trip-1" />)
    expect(screen.getByText('memories_error')).toBeInTheDocument()
  })

  it('shows the empty state when there are no memories', () => {
    mockUseMemories.mockReturnValue({ data: [], isLoading: false, isError: false })
    render(<MemoriesList tripId="trip-1" />)
    expect(screen.getByText('no-memories')).toBeInTheDocument()
  })

  it('renders the masonry grid with a count when memories exist', () => {
    mockUseMemories.mockReturnValue({
      data: [{ id: '1' }, { id: '2' }],
      isLoading: false,
      isError: false,
    })
    render(<MemoriesList tripId="trip-1" />)
    expect(screen.getByText('memories:2')).toBeInTheDocument()
    expect(screen.getByText('2 memories_heading')).toBeInTheDocument()
  })
})
