import { fireEvent, render, screen } from '@testing-library/react-native'
import type { Memory } from '@passe/types/memory'
import { MemoryLayoutMenu } from './MemoryLayoutMenu'

// The mutation/reorder/navigation logic behind this menu is exercised
// directly in useMemoryLayoutActions.test.ts. DropdownMenuTrigger opens via
// measureInWindow, which never resolves under Jest's test renderer (see
// DropdownMenu.test.tsx), so driving the dropdown open here isn't possible —
// this only smoke-tests that the trigger renders and can be pressed.
jest.mock('@passe/hooks', () => ({
  useUpdateMemory: () => ({ mutate: jest.fn(), isPending: false }),
  useReorderMemories: () => ({ mutate: jest.fn(), isPending: false }),
  useDeleteMemory: () => ({ mutate: jest.fn(), isPending: false }),
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

describe('MemoryLayoutMenu', () => {
  it('does not show menu items before the trigger is pressed', () => {
    render(<MemoryLayoutMenu memory={baseMemory} orderedIds={orderedIds} index={1} />)
    expect(screen.queryByText('variant_auto')).toBeNull()
  })

  it('does not throw when the trigger is pressed', () => {
    render(<MemoryLayoutMenu memory={baseMemory} orderedIds={orderedIds} index={1} />)
    expect(() => fireEvent.press(screen.getByLabelText('menu_label'))).not.toThrow()
  })

  it('does not show the delete confirmation dialog by default', () => {
    render(<MemoryLayoutMenu memory={baseMemory} orderedIds={orderedIds} index={1} />)
    expect(screen.queryByText('delete_title')).toBeNull()
  })
})
