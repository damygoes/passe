import { fireEvent, render, screen } from '@testing-library/react-native'
import { useState } from 'react'
import { Segmented } from './Segmented'

const OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'private', label: 'Private' },
  { value: 'shared', label: 'Shared' },
]

function ControlledSegmented() {
  const [value, setValue] = useState('all')
  return <Segmented options={OPTIONS} value={value} onValueChange={setValue} />
}

describe('Segmented', () => {
  it('renders every option', () => {
    render(<ControlledSegmented />)
    expect(screen.getByText('All')).toBeTruthy()
    expect(screen.getByText('Private')).toBeTruthy()
    expect(screen.getByText('Shared')).toBeTruthy()
  })

  it('marks the current value as checked', () => {
    render(<ControlledSegmented />)
    expect(screen.getByRole('radio', { name: 'All' }).props.accessibilityState?.checked).toBe(true)
    expect(screen.getByRole('radio', { name: 'Private' }).props.accessibilityState?.checked).toBe(
      false,
    )
  })

  it('calls onValueChange when a different option is pressed', () => {
    render(<ControlledSegmented />)
    fireEvent.press(screen.getByText('Private'))
    expect(screen.getByRole('radio', { name: 'Private' }).props.accessibilityState?.checked).toBe(
      true,
    )
    expect(screen.getByRole('radio', { name: 'All' }).props.accessibilityState?.checked).toBe(false)
  })
})
