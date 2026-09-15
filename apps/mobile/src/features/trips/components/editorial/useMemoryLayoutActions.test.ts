import { act, renderHook } from '@testing-library/react-native'
import type { Memory } from '@passe/types/memory'
import { mockPush } from '@/test/expo-router-mock'
import { useMemoryLayoutActions } from './useMemoryLayoutActions'

const mockUpdateMutate = jest.fn()
const mockReorderMutate = jest.fn()
const mockDeleteMutate = jest.fn()

jest.mock('@passe/hooks', () => ({
  useUpdateMemory: () => ({ mutate: mockUpdateMutate, isPending: false }),
  useReorderMemories: () => ({ mutate: mockReorderMutate, isPending: false }),
  useDeleteMemory: () => ({ mutate: mockDeleteMutate, isPending: false }),
}))

const baseMemory: Memory = {
  id: 'memory-1',
  tripId: 'trip-1',
  userId: 'user-1',
  note: null,
  media: [],
  location: null,
  city: null,
  country: null,
  placeName: null,
  tags: [],
  capturedAt: new Date('2026-01-01'),
  isPublic: false,
  layoutVariant: 'auto',
  sortOrder: null,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
}

const orderedIds = ['memory-0', 'memory-1', 'memory-2']

describe('useMemoryLayoutActions', () => {
  beforeEach(() => {
    mockUpdateMutate.mockClear()
    mockReorderMutate.mockClear()
    mockDeleteMutate.mockClear()
    mockPush.mockClear()
  })

  it('sets the layout variant', () => {
    const { result } = renderHook(() => useMemoryLayoutActions(baseMemory, orderedIds, 1))
    act(() => result.current.setVariant('hero'))
    expect(mockUpdateMutate).toHaveBeenCalledWith(
      { id: 'memory-1', tripId: 'trip-1', layoutVariant: 'hero' },
      expect.any(Object),
    )
  })

  it('moves the memory up by splicing orderedIds and reordering', () => {
    const { result } = renderHook(() => useMemoryLayoutActions(baseMemory, orderedIds, 1))
    act(() => result.current.handleMove(-1))
    expect(mockReorderMutate).toHaveBeenCalledWith(
      { tripId: 'trip-1', orderedIds: ['memory-1', 'memory-0', 'memory-2'] },
      expect.any(Object),
    )
  })

  it('moves the memory down by splicing orderedIds and reordering', () => {
    const { result } = renderHook(() => useMemoryLayoutActions(baseMemory, orderedIds, 1))
    act(() => result.current.handleMove(1))
    expect(mockReorderMutate).toHaveBeenCalledWith(
      { tripId: 'trip-1', orderedIds: ['memory-0', 'memory-2', 'memory-1'] },
      expect.any(Object),
    )
  })

  it('does not reorder past the start or end of the list', () => {
    const { result: atStart } = renderHook(() => useMemoryLayoutActions(baseMemory, orderedIds, 0))
    act(() => atStart.current.handleMove(-1))
    expect(mockReorderMutate).not.toHaveBeenCalled()

    const { result: atEnd } = renderHook(() => useMemoryLayoutActions(baseMemory, orderedIds, 2))
    act(() => atEnd.current.handleMove(1))
    expect(mockReorderMutate).not.toHaveBeenCalled()
  })

  it('makes a private memory public', () => {
    const { result } = renderHook(() => useMemoryLayoutActions(baseMemory, orderedIds, 1))
    act(() => result.current.handleTogglePublic())
    expect(mockUpdateMutate).toHaveBeenCalledWith(
      { id: 'memory-1', tripId: 'trip-1', isPublic: true },
      expect.any(Object),
    )
  })

  it('makes a public memory private', () => {
    const { result } = renderHook(() =>
      useMemoryLayoutActions({ ...baseMemory, isPublic: true }, orderedIds, 1),
    )
    act(() => result.current.handleTogglePublic())
    expect(mockUpdateMutate).toHaveBeenCalledWith(
      { id: 'memory-1', tripId: 'trip-1', isPublic: false },
      expect.any(Object),
    )
  })

  it('navigates to the edit-memory route', () => {
    const { result } = renderHook(() => useMemoryLayoutActions(baseMemory, orderedIds, 1))
    act(() => result.current.handleEdit())
    expect(mockPush).toHaveBeenCalledWith('/(app)/trips/edit-memory/memory-1?tripId=trip-1')
  })

  it('deletes the memory', () => {
    const { result } = renderHook(() => useMemoryLayoutActions(baseMemory, orderedIds, 1))
    act(() => result.current.handleDelete())
    expect(mockDeleteMutate).toHaveBeenCalledWith(
      { id: 'memory-1', tripId: 'trip-1' },
      expect.any(Object),
    )
  })

  it('opens and closes the delete confirmation state', () => {
    const { result } = renderHook(() => useMemoryLayoutActions(baseMemory, orderedIds, 1))
    expect(result.current.deleteOpen).toBe(false)
    act(() => result.current.setDeleteOpen(true))
    expect(result.current.deleteOpen).toBe(true)
  })
})
