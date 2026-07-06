import { render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'
import { FormField } from './FormField'

describe('FormField', () => {
  it('renders the label and forwards input props', () => {
    render(<FormField label="Email" placeholder="you@example.com" />)
    expect(screen.getByText('Email')).toBeTruthy()
    expect(screen.getByPlaceholderText('you@example.com')).toBeTruthy()
  })

  it('renders an error message when provided', () => {
    render(<FormField label="Email" error="Invalid email" />)
    expect(screen.getByText('Invalid email')).toBeTruthy()
  })

  it('does not render an error message when absent', () => {
    render(<FormField label="Email" />)
    expect(screen.queryByText('Invalid email')).toBeNull()
  })

  it('renders labelRight content alongside the label', () => {
    render(<FormField label="Password" labelRight={<Text>Forgot?</Text>} />)
    expect(screen.getByText('Forgot?')).toBeTruthy()
  })
})
