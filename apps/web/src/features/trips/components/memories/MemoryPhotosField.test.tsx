import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryPhotosField } from './MemoryPhotosField'

const mockMutateAsync = vi.fn()
vi.mock('@passe/hooks', () => ({
  useUploadImage: () => ({ mutateAsync: mockMutateAsync, isPending: false }),
}))

beforeEach(() => {
  mockMutateAsync.mockReset()
})

describe('MemoryPhotosField', () => {
  it('renders one tile per existing photo plus the add tile', () => {
    render(
      <MemoryPhotosField
        id="photos"
        photos={[{ url: 'https://example.com/a.jpg', width: 1, height: 1 }]}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
      />,
    )
    expect(screen.getAllByAltText('preview_alt')).toHaveLength(1)
    expect(screen.getByText('add_photo')).toBeInTheDocument()
  })

  it('calls onRemove with the photo index', async () => {
    const onRemove = vi.fn()
    const user = userEvent.setup()
    render(
      <MemoryPhotosField
        id="photos"
        photos={[{ url: 'https://example.com/a.jpg', width: 1, height: 1 }]}
        onAdd={vi.fn()}
        onRemove={onRemove}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'remove_photo' }))
    expect(onRemove).toHaveBeenCalledWith(0)
  })

  it('uploads each selected file and calls onAdd per result', async () => {
    mockMutateAsync.mockResolvedValue({ url: 'https://example.com/new.jpg', width: 2, height: 2 })
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<MemoryPhotosField id="photos" photos={[]} onAdd={onAdd} onRemove={vi.fn()} />)

    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    const input = document.getElementById('photos') as HTMLInputElement
    await user.upload(input, file)

    await waitFor(() =>
      expect(onAdd).toHaveBeenCalledWith({ url: 'https://example.com/new.jpg', width: 2, height: 2 }),
    )
  })

  it('shows an error message when a file upload fails', async () => {
    mockMutateAsync.mockRejectedValue(new Error('upload failed'))
    const user = userEvent.setup()
    render(<MemoryPhotosField id="photos" photos={[]} onAdd={vi.fn()} onRemove={vi.fn()} />)

    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    const input = document.getElementById('photos') as HTMLInputElement
    await user.upload(input, file)

    expect(await screen.findByText('upload_failed')).toBeInTheDocument()
  })
})
