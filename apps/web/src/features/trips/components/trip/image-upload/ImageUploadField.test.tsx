import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ImageUploadField } from './ImageUploadField'

const mockMutateAsync = vi.fn()
vi.mock('@passe/hooks', () => ({
  useUploadImage: () => ({ mutateAsync: mockMutateAsync, isPending: false }),
}))

vi.mock('@/lib/media/image-compression', () => ({
  compressImage: vi.fn().mockResolvedValue({
    blob: new Blob(['compressed'], { type: 'image/jpeg' }),
    contentType: 'image/jpeg',
    width: 100,
    height: 100,
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

  it('compresses the selected file, uploads it, and calls onChange with the resulting key', async () => {
    mockMutateAsync.mockResolvedValue({ key: 'passe/user-1/uploaded.jpg' })
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<ImageUploadField id="cover" value={null} onChange={onChange} />)

    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    const input = document.getElementById('cover') as HTMLInputElement
    await user.upload(input, file)

    await waitFor(() => expect(onChange).toHaveBeenCalledWith('passe/user-1/uploaded.jpg'))
    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({ contentType: 'image/jpeg', put: expect.any(Function) }),
    )
  })

  it('previews the freshly uploaded file locally without waiting on a re-fetch', async () => {
    mockMutateAsync.mockResolvedValue({ key: 'passe/user-1/uploaded.jpg' })
    const user = userEvent.setup()
    render(<ImageUploadField id="cover" value={null} onChange={vi.fn()} />)

    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    const input = document.getElementById('cover') as HTMLInputElement
    await user.upload(input, file)

    await waitFor(() =>
      expect(screen.getByAltText('preview_alt')).toHaveAttribute(
        'src',
        expect.stringContaining('blob'),
      ),
    )
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
