import { fireEvent, render, screen } from '@testing-library/react-native'
import { Dimensions, Text } from 'react-native'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuContext,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './DropdownMenu'

// Dimensions.set is React Native's own test hook for controlling what useWindowDimensions()
// (backed by Dimensions.get('window')) reports — see Libraries/Utilities/Dimensions.js.
// useSafeAreaInsets() is mocked globally in jest.setup.js to return zero insets.
Dimensions.set({ window: { width: 375, height: 400, scale: 2, fontScale: 1 } })

// DropdownMenuTrigger opens the menu via `ref.current.measureInWindow(callback)` to position
// the popover under the trigger. React Native's Fabric host-component measure APIs resolve to a
// native element reference that doesn't exist under Jest's test renderer, so the callback never
// fires and the menu can't be driven open through the public trigger in this environment. The
// trigger-press smoke test below only asserts it doesn't throw; DropdownMenuItem's onPress/close
// behavior — the actual business logic — is exercised directly instead.

function TestMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Text>Open menu</Text>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

describe('DropdownMenu', () => {
  it('does not show menu items before the trigger is pressed', () => {
    render(<TestMenu />)
    expect(screen.queryByText('Delete')).toBeNull()
  })

  it('does not throw when the trigger is pressed', () => {
    render(<TestMenu />)
    expect(() => fireEvent.press(screen.getByText('Open menu'))).not.toThrow()
  })
})

describe('DropdownMenuItem', () => {
  it('calls onPress when pressed', () => {
    const onPress = jest.fn()
    render(<DropdownMenuItem onPress={onPress}>Delete</DropdownMenuItem>)
    fireEvent.press(screen.getByText('Delete'))
    expect(onPress).toHaveBeenCalled()
  })
})

// DropdownMenuContent's placement can't be driven through the public trigger either (same
// measureInWindow limitation above), so it's exercised directly through the exported context —
// providing `triggerLayout`/`contentSize` as if a real device had already measured both, the
// same values DropdownMenuTrigger's handlePress and DropdownMenuContent's onLayout would produce.
function flattenStyle(style: unknown): Record<string, number> {
  return Array.isArray(style)
    ? Object.assign({}, ...style.flat(Infinity).filter(Boolean))
    : (style as Record<string, number>)
}

function renderPositioned(
  triggerLayout: { x: number; y: number; width: number; height: number },
  contentSize: { width: number; height: number } | null,
) {
  return render(
    <DropdownMenuContext.Provider
      value={{
        open: true,
        setOpen: jest.fn(),
        triggerLayout,
        setTriggerLayout: jest.fn(),
        contentSize,
        setContentSize: jest.fn(),
      }}
    >
      <DropdownMenuContent testID="content">
        <DropdownMenuItem>Option</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuContext.Provider>,
  )
}

describe('DropdownMenuContent placement', () => {
  // Mocked useWindowDimensions() above returns a 375x400 window.

  it('flips above the trigger when there is not enough space below', () => {
    const triggerLayout = { x: 20, y: 350, width: 100, height: 20 }
    renderPositioned(triggerLayout, { width: 180, height: 150 })
    const style = flattenStyle(screen.getByTestId('content').props.style)
    expect(style.top).toBeLessThan(triggerLayout.y)
  })

  it('keeps opening below the trigger when there is enough space (no regression)', () => {
    const triggerLayout = { x: 20, y: 20, width: 100, height: 20 }
    renderPositioned(triggerLayout, { width: 180, height: 100 })
    const style = flattenStyle(screen.getByTestId('content').props.style)
    expect(style.top).toBeGreaterThan(triggerLayout.y)
  })

  it('clamps horizontally so the content stays within the window', () => {
    const triggerLayout = { x: 300, y: 20, width: 60, height: 20 }
    renderPositioned(triggerLayout, { width: 180, height: 100 })
    const style = flattenStyle(screen.getByTestId('content').props.style)
    expect(style.left + 180).toBeLessThanOrEqual(375)
    expect(style.left).toBeGreaterThanOrEqual(0)
  })
})
