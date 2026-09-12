import { render, screen } from '@testing-library/react-native'
import { StatTile } from './StatTile'

// AnimatedNumber renders its value through an animated TextInput
// (useAnimatedProps), which isn't mocked in this project's jest-expo setup —
// see PersonalStatsDataWrapper.test.tsx for the same workaround. Mock it out
// so these tests cover StatTile's own composition (label, note, tone).
jest.mock('@/components/ui/animated-number', () => {
  const { Text } = require('react-native')
  return {
    AnimatedNumber: ({ value, style }: { value: number; style?: unknown }) => (
      <Text style={style}>{value}</Text>
    ),
  }
})

describe('StatTile', () => {
  it('renders the value and label', () => {
    render(<StatTile value={47} label="Cities" />)
    expect(screen.getByText('47')).toBeTruthy()
    expect(screen.getByText('Cities')).toBeTruthy()
  })

  it('renders an optional note', () => {
    render(<StatTile value={12} label="Countries" note="Morocco was the twelfth." />)
    expect(screen.getByText('Morocco was the twelfth.')).toBeTruthy()
  })

  it('omits the note when not provided', () => {
    render(<StatTile value={9} label="Trips" />)
    expect(screen.queryByText('Morocco was the twelfth.')).toBeNull()
  })

  it('renders every tone without throwing', () => {
    expect(() => render(<StatTile value={1} label="Plain" tone="plain" />)).not.toThrow()
    expect(() => render(<StatTile value={1} label="Surface" tone="surface" />)).not.toThrow()
    expect(() => render(<StatTile value={1} label="Sand" tone="sand" />)).not.toThrow()
  })
})
