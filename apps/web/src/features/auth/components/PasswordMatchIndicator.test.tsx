import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PasswordMatchIndicator } from './PasswordMatchIndicator'

describe('PasswordMatchIndicator', () => {
  it('renders nothing when password is empty', () => {
    const { container } = render(
      <PasswordMatchIndicator password="" confirmPassword="abc" />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when confirmPassword is empty', () => {
    const { container } = render(
      <PasswordMatchIndicator password="abc" confirmPassword="" />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('shows a match message when passwords are equal', () => {
    render(<PasswordMatchIndicator password="abc123" confirmPassword="abc123" />)
    expect(screen.getByText('match')).toBeInTheDocument()
  })

  it('shows a no-match message when passwords differ', () => {
    render(<PasswordMatchIndicator password="abc123" confirmPassword="xyz789" />)
    expect(screen.getByText('no_match')).toBeInTheDocument()
  })
})
