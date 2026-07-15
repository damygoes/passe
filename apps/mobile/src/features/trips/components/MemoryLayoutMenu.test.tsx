import { fireEvent, render, screen } from '@testing-library/react-native'
import type { Memory } from '@passe/types/memory'
import { MemoryLayoutMenu } from './MemoryLayoutMenu'

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
  capturedAt: new Date('2026-01-01'),
  isPublic: false,
  layoutVariant: 'auto',
  sortOrder: null,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
}

const orderedIds = ['memory-0', 'memory-1', 'memory-2']

describe('MemoryLayoutMenu', () => {
  beforeEach(() => {
    mockUpdateMutate.mockClear()
    mockReorderMutate.mockClear()
    mockDeleteMutate.mockClear()
  })

  it('shows the current layout variant on the trigger', () => {
    render(
      <MemoryLayoutMenu
        memory={baseMemory}
        resolvedVariant="hero"
        orderedIds={orderedIds}
        index={1}
      />,
    )
    expect(screen.getByText('variant_auto')).toBeTruthy()
  })

  it('does not throw when the trigger is pressed', () => {
    render(
      <MemoryLayoutMenu
        memory={baseMemory}
        resolvedVariant="hero"
        orderedIds={orderedIds}
        index={1}
      />,
    )
    expect(() => fireEvent.press(screen.getByText('variant_auto'))).not.toThrow()
  })

  it('only shows the flip button for imageLeft/imageRight sections', () => {
    const { rerender } = render(
      <MemoryLayoutMenu
        memory={baseMemory}
        resolvedVariant="hero"
        orderedIds={orderedIds}
        index={1}
      />,
    )
    expect(screen.queryByLabelText('flip')).toBeNull()

    rerender(
      <MemoryLayoutMenu
        memory={baseMemory}
        resolvedVariant="imageLeft"
        orderedIds={orderedIds}
        index={1}
      />,
    )
    expect(screen.getByLabelText('flip')).toBeTruthy()
  })

  it('flips image_left to image_right', () => {
    render(
      <MemoryLayoutMenu
        memory={baseMemory}
        resolvedVariant="imageLeft"
        orderedIds={orderedIds}
        index={1}
      />,
    )
    fireEvent.press(screen.getByLabelText('flip'))
    expect(mockUpdateMutate).toHaveBeenCalledWith(
      { id: 'memory-1', tripId: 'trip-1', layoutVariant: 'image_right' },
      expect.any(Object),
    )
  })

  it('flips image_right to image_left', () => {
    render(
      <MemoryLayoutMenu
        memory={baseMemory}
        resolvedVariant="imageRight"
        orderedIds={orderedIds}
        index={1}
      />,
    )
    fireEvent.press(screen.getByLabelText('flip'))
    expect(mockUpdateMutate).toHaveBeenCalledWith(
      { id: 'memory-1', tripId: 'trip-1', layoutVariant: 'image_left' },
      expect.any(Object),
    )
  })

  it('disables move up at the start of the order and move down at the end', () => {
    const { rerender } = render(
      <MemoryLayoutMenu
        memory={baseMemory}
        resolvedVariant="hero"
        orderedIds={orderedIds}
        index={0}
      />,
    )
    expect(screen.getByLabelText('move_up').props.accessibilityState?.disabled).toBe(true)
    expect(screen.getByLabelText('move_down').props.accessibilityState?.disabled).toBe(false)

    rerender(
      <MemoryLayoutMenu
        memory={baseMemory}
        resolvedVariant="hero"
        orderedIds={orderedIds}
        index={2}
      />,
    )
    expect(screen.getByLabelText('move_up').props.accessibilityState?.disabled).toBe(false)
    expect(screen.getByLabelText('move_down').props.accessibilityState?.disabled).toBe(true)
  })

  it('moves the memory up by splicing orderedIds and reordering', () => {
    render(
      <MemoryLayoutMenu
        memory={baseMemory}
        resolvedVariant="hero"
        orderedIds={orderedIds}
        index={1}
      />,
    )
    fireEvent.press(screen.getByLabelText('move_up'))
    expect(mockReorderMutate).toHaveBeenCalledWith(
      { tripId: 'trip-1', orderedIds: ['memory-1', 'memory-0', 'memory-2'] },
      expect.any(Object),
    )
  })

  it('moves the memory down by splicing orderedIds and reordering', () => {
    render(
      <MemoryLayoutMenu
        memory={baseMemory}
        resolvedVariant="hero"
        orderedIds={orderedIds}
        index={1}
      />,
    )
    fireEvent.press(screen.getByLabelText('move_down'))
    expect(mockReorderMutate).toHaveBeenCalledWith(
      { tripId: 'trip-1', orderedIds: ['memory-0', 'memory-2', 'memory-1'] },
      expect.any(Object),
    )
  })

  it('makes a private memory public', () => {
    render(
      <MemoryLayoutMenu
        memory={baseMemory}
        resolvedVariant="hero"
        orderedIds={orderedIds}
        index={1}
      />,
    )
    fireEvent.press(screen.getByLabelText('make_public'))
    expect(mockUpdateMutate).toHaveBeenCalledWith(
      { id: 'memory-1', tripId: 'trip-1', isPublic: true },
      expect.any(Object),
    )
  })

  it('makes a public memory private', () => {
    render(
      <MemoryLayoutMenu
        memory={{ ...baseMemory, isPublic: true }}
        resolvedVariant="hero"
        orderedIds={orderedIds}
        index={1}
      />,
    )
    fireEvent.press(screen.getByLabelText('make_private'))
    expect(mockUpdateMutate).toHaveBeenCalledWith(
      { id: 'memory-1', tripId: 'trip-1', isPublic: false },
      expect.any(Object),
    )
  })

  describe('delete', () => {
    it('does not show the confirmation dialog before the trigger is pressed', () => {
      render(
        <MemoryLayoutMenu
          memory={baseMemory}
          resolvedVariant="hero"
          orderedIds={orderedIds}
          index={1}
        />,
      )
      expect(screen.queryByText('delete_title')).toBeNull()
    })

    it('opens the confirmation dialog and does not delete on cancel', () => {
      render(
        <MemoryLayoutMenu
          memory={baseMemory}
          resolvedVariant="hero"
          orderedIds={orderedIds}
          index={1}
        />,
      )
      fireEvent.press(screen.getByLabelText('delete'))
      expect(screen.getByText('delete_title')).toBeTruthy()

      fireEvent.press(screen.getByText('delete_cancel'))
      expect(mockDeleteMutate).not.toHaveBeenCalled()
    })

    it('deletes the memory on confirm', () => {
      render(
        <MemoryLayoutMenu
          memory={baseMemory}
          resolvedVariant="hero"
          orderedIds={orderedIds}
          index={1}
        />,
      )
      fireEvent.press(screen.getByLabelText('delete'))
      fireEvent.press(screen.getByText('delete_confirm'))
      expect(mockDeleteMutate).toHaveBeenCalledWith(
        { id: 'memory-1', tripId: 'trip-1' },
        expect.any(Object),
      )
    })
  })
})
