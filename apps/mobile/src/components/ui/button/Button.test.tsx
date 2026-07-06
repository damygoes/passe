import { fireEvent, render, screen } from '@testing-library/react-native'
import { Button } from './Button'

describe('Button', () => {
  it('renders its text label', () => {
    render(<Button>Save</Button>)
    expect(screen.getByText('Save')).toBeTruthy()
  })

  it('calls onPress when tapped', () => {
    const onPress = jest.fn()
    render(<Button onPress={onPress}>Save</Button>)
    fireEvent.press(screen.getByText('Save'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn()
    render(
      <Button onPress={onPress} disabled>
        Save
      </Button>,
    )
    fireEvent.press(screen.getByText('Save'))
    expect(onPress).not.toHaveBeenCalled()
  })

  it('shows a spinner instead of the label while loading', () => {
    render(<Button loading>Save</Button>)
    expect(screen.queryByText('Save')).toBeNull()
  })
})
