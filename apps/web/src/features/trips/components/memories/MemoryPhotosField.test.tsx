import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryPhotosField } from './MemoryPhotosField'

const mockMutateAsync = vi.fn()
vi.mock('@passe/hooks', () => ({
  useUploadImage: () => ({ mutateAsync: mockMutateAsync, isPending: false }),
}))

vi.mock('@/lib/media/image-compression', () => ({
  compressImage: vi.fn().mockResolvedValue({
    blob: new Blob(['compressed'], { type: 'image/jpeg' }),
    contentType: 'image/jpeg',
    width: 2,
    height: 2,
  }),
}))

beforeEach(() => {
  mockMutateAsync.mockReset()
  vi.stubGlobal('URL', {
    ...URL,
    createObjectURL: vi.fn(() => 'blob:mock-preview-url'),
    revokeObjectURL: vi.fn(),
  })
})

describe('MemoryPhotosField', () => {
  it('renders one tile per existing photo plus the add tile', () => {
    render(
      <MemoryPhotosField
        id="photos"
        photos={[
          {
            url: 'https://example.com/a.jpg',
            previewUri: 'https://example.com/a.jpg',
            width: 1,
            height: 1,
          },
        ]}
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
        photos={[
          {
            url: 'https://example.com/a.jpg',
            previewUri: 'https://example.com/a.jpg',
            width: 1,
            height: 1,
          },
        ]}
        onAdd={vi.fn()}
        onRemove={onRemove}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'remove_photo' }))
    expect(onRemove).toHaveBeenCalledWith(0)
  })

  it('compresses, uploads each selected file, and calls onAdd with the key + local preview', async () => {
    mockMutateAsync.mockResolvedValue({ key: 'passe/user-1/new.jpg' })
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<MemoryPhotosField id="photos" photos={[]} onAdd={onAdd} onRemove={vi.fn()} />)

    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    const input = document.getElementById('photos') as HTMLInputElement
    await user.upload(input, file)

    await waitFor(() =>
      expect(onAdd).toHaveBeenCalledWith({
        url: 'passe/user-1/new.jpg',
        previewUri: 'blob:mock-preview-url',
        width: 2,
        height: 2,
      }),
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
