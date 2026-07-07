import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ImageUploadField } from './ImageUploadField'

const mockMutateAsync = vi.fn()
vi.mock('@passe/hooks', () => ({
  useUploadImage: () => ({ mutateAsync: mockMutateAsync, isPending: false }),
}))

beforeEach(() => {
  mockMutateAsync.mockReset()
})

describe('ImageUploadField', () => {
  it('shows the upload prompt when there is no value', () => {
    render(<ImageUploadField id="cover" value={null} onChange={vi.fn()} />)
    expect(screen.getByText('upload_prompt')).toBeInTheDocument()
  })

  it('shows a preview and remove button when a value is set', () => {
    render(<ImageUploadField id="cover" value="https://example.com/a.jpg" onChange={vi.fn()} />)
    expect(screen.getByAltText('preview_alt')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /remove/ })).toBeInTheDocument()
  })

  it('calls onChange(null) when remove is clicked', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<ImageUploadField id="cover" value="https://example.com/a.jpg" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: /remove/ }))
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('uploads the selected file and calls onChange with the resulting url', async () => {
    mockMutateAsync.mockResolvedValue({ url: 'https://example.com/uploaded.jpg' })
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<ImageUploadField id="cover" value={null} onChange={onChange} />)

    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    const input = document.getElementById('cover') as HTMLInputElement
    await user.upload(input, file)

    await waitFor(() => expect(onChange).toHaveBeenCalledWith('https://example.com/uploaded.jpg'))
  })

  it('shows an error message when the upload fails', async () => {
    mockMutateAsync.mockRejectedValue(new Error('upload failed'))
    const user = userEvent.setup()
    render(<ImageUploadField id="cover" value={null} onChange={vi.fn()} />)

    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    const input = document.getElementById('cover') as HTMLInputElement
    await user.upload(input, file)

    expect(await screen.findByText('upload_failed')).toBeInTheDocument()
  })
})
