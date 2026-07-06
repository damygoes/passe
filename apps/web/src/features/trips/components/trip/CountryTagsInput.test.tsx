import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CountryTagsInput } from './CountryTagsInput'

function setup(initial: string[] = []) {
  const onChange = vi.fn()
  function Wrapper() {
    return <CountryTagsInput value={initial} onChange={onChange} removeLabel="Remove" />
  }
  render(<Wrapper />)
  return { onChange }
}

describe('CountryTagsInput', () => {
  it('adds a country on Enter', async () => {
    const user = userEvent.setup()
    const { onChange } = setup([])
    await user.type(screen.getByRole('textbox'), 'France{Enter}')
    expect(onChange).toHaveBeenCalledWith(['France'])
  })

  it('adds a country on comma', async () => {
    const user = userEvent.setup()
    const { onChange } = setup([])
    await user.type(screen.getByRole('textbox'), 'Japan,')
    expect(onChange).toHaveBeenCalledWith(['Japan'])
  })

  it('does not add a duplicate country (case-insensitive)', async () => {
    const user = userEvent.setup()
    const { onChange } = setup(['France'])
    await user.type(screen.getByRole('textbox'), 'france{Enter}')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('removes the last country on Backspace when the input is empty', async () => {
    const user = userEvent.setup()
    const { onChange } = setup(['France', 'Japan'])
    screen.getByRole('textbox').focus()
    await user.keyboard('{Backspace}')
    expect(onChange).toHaveBeenCalledWith(['France'])
  })

  it('removes a country when its remove button is clicked', async () => {
    const user = userEvent.setup()
    const { onChange } = setup(['France', 'Japan'])
    await user.click(screen.getByRole('button', { name: 'Remove France' }))
    expect(onChange).toHaveBeenCalledWith(['Japan'])
  })

  it('adds the draft country on blur', async () => {
    const user = userEvent.setup()
    const { onChange } = setup([])
    await user.type(screen.getByRole('textbox'), 'Italy')
    await user.tab()
    expect(onChange).toHaveBeenCalledWith(['Italy'])
  })
})
