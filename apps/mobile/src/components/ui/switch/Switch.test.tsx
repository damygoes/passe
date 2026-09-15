import { fireEvent, render, screen } from '@testing-library/react-native'
import { useState } from 'react'
import { Switch } from './Switch'

function ControlledSwitch() {
  const [checked, setChecked] = useState(false)
  return (
    <Switch checked={checked} onCheckedChange={setChecked} accessibilityLabel="publish toggle" />
  )
}

describe('Switch', () => {
  it('starts unchecked', () => {
    render(<ControlledSwitch />)
    expect(screen.getByRole('switch').props.accessibilityState?.checked).toBe(false)
  })

  it('toggles checked state on press', () => {
    render(<ControlledSwitch />)
    fireEvent.press(screen.getByRole('switch'))
    expect(screen.getByRole('switch').props.accessibilityState?.checked).toBe(true)
  })

  it('does not fire onCheckedChange when disabled', () => {
    const onCheckedChange = jest.fn()
    render(<Switch checked={false} onCheckedChange={onCheckedChange} disabled />)
    fireEvent.press(screen.getByRole('switch'))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})
