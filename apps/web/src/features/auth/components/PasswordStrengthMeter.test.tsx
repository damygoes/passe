import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'

describe('PasswordStrengthMeter', () => {
  it('renders nothing when password is empty', () => {
    const { container } = render(<PasswordStrengthMeter password="" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('labels a password matching one rule as weak', () => {
    render(<PasswordStrengthMeter password="a" />)
    expect(screen.getByText('weak')).toBeInTheDocument()
  })

  it('labels a password matching all five rules as very_strong', () => {
    render(<PasswordStrengthMeter password="Abcdef1!" />)
    expect(screen.getByText('very_strong')).toBeInTheDocument()
  })

  it('renders a rule item per PASSWORD_RULES entry', () => {
    render(<PasswordStrengthMeter password="Abcdef1!" />)
    expect(screen.getByText('length')).toBeInTheDocument()
    expect(screen.getByText('uppercase')).toBeInTheDocument()
    expect(screen.getByText('lowercase')).toBeInTheDocument()
    expect(screen.getByText('number')).toBeInTheDocument()
    expect(screen.getByText('special')).toBeInTheDocument()
  })
})
