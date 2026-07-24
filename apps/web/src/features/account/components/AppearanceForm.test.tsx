import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AppearanceForm } from './AppearanceForm'

const mockMutate = vi.fn()
vi.mock('@passe/hooks', () => ({
  useUpdateUser: () => ({
    mutate: mockMutate,
    isPending: false,
    isError: false,
    variables: undefined,
  }),
}))

describe('AppearanceForm', () => {
  it('locks the scrapbook option for the free plan with an upgrade link', () => {
    render(<AppearanceForm theme="editorial" plan="free" />)
    expect(screen.getByText('locked_note')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /upgrade_cta/ })).toBeInTheDocument()
  })

  it('lets an explorer-plan user select the scrapbook theme', async () => {
    const user = userEvent.setup()
    render(<AppearanceForm theme="editorial" plan="explorer" />)

    await user.click(screen.getByRole('button', { name: /select_cta/ }))
    expect(mockMutate).toHaveBeenCalledWith({ theme: 'scrapbook' }, expect.anything())
  })

  it('disables the active theme button', () => {
    render(<AppearanceForm theme="scrapbook" plan="explorer" />)
    expect(screen.getByRole('button', { name: 'current_label' })).toBeDisabled()
  })
})
