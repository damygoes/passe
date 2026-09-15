import { fireEvent, render, screen } from '@testing-library/react-native'
import { mockPush } from '@/test/expo-router-mock'
import { MemoriesList } from './MemoriesList'

const mockUseMemories = jest.fn()
jest.mock('@passe/hooks', () => ({ useMemories: () => mockUseMemories() }))

jest.mock('./MemoriesListSkeleton', () => {
  const { Text } = require('react-native')
  return { MemoriesListSkeleton: () => <Text>loading-skeleton</Text> }
})
jest.mock('./NoMemoriesEmpty', () => {
  const { Text } = require('react-native')
  return { NoMemoriesEmpty: () => <Text>no-memories</Text> }
})
jest.mock('./MemoriesMasonryGrid', () => {
  const { Text } = require('react-native')
  return {
    MemoriesMasonryGrid: ({ memories }: { memories: unknown[] }) => (
      <Text>memories:{memories.length}</Text>
    ),
  }
})

describe('MemoriesList', () => {
  it('shows a skeleton while loading', () => {
    mockUseMemories.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    render(<MemoriesList tripId="trip-1" />)
    expect(screen.getByText('loading-skeleton')).toBeTruthy()
  })

  it('shows an error message on error', () => {
    mockUseMemories.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    render(<MemoriesList tripId="trip-1" />)
    expect(screen.getByText('memories_error')).toBeTruthy()
  })

  it('shows the empty state when there are no memories', () => {
    mockUseMemories.mockReturnValue({ data: [], isLoading: false, isError: false })
    render(<MemoriesList tripId="trip-1" />)
    expect(screen.getByText('no-memories')).toBeTruthy()
  })

  it('renders the masonry grid with a count when memories exist', () => {
    mockUseMemories.mockReturnValue({
      data: [{ id: '1' }, { id: '2' }],
      isLoading: false,
      isError: false,
    })
    render(<MemoriesList tripId="trip-1" />)
    expect(screen.getByText('memories:2')).toBeTruthy()
  })

  it('navigates to the add-memory screen when the add button is pressed', () => {
    mockUseMemories.mockReturnValue({ data: [], isLoading: false, isError: false })
    render(<MemoriesList tripId="trip-1" />)
    fireEvent.press(screen.getByText('add_memory'))
    expect(mockPush).toHaveBeenCalledWith('/(app)/trips/new-memory/trip-1')
  })
})
