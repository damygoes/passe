import * as FileSystem from 'expo-file-system'
import { uploadFileToUrl } from './upload-put'

const mockUpload = jest.fn()

jest.mock('expo-file-system', () => ({
  File: jest.fn().mockImplementation((uri: string) => ({ uri, upload: mockUpload })),
  UploadType: { BINARY_CONTENT: 0, MULTIPART: 1 },
}))

beforeEach(() => {
  mockUpload.mockReset()
})

describe('uploadFileToUrl', () => {
  it('PUTs the file as binary content with the given content type', async () => {
    mockUpload.mockResolvedValue({ status: 200, body: '', headers: {} })

    await uploadFileToUrl('https://s3.mock/presigned-put', 'file:///photo.jpg', 'image/jpeg')

    expect(FileSystem.File).toHaveBeenCalledWith('file:///photo.jpg')
    expect(mockUpload).toHaveBeenCalledWith('https://s3.mock/presigned-put', {
      httpMethod: 'PUT',
      uploadType: FileSystem.UploadType.BINARY_CONTENT,
      headers: { 'Content-Type': 'image/jpeg' },
    })
  })

  it('resolves for any 2xx status', async () => {
    mockUpload.mockResolvedValue({ status: 204, body: '', headers: {} })
    await expect(
      uploadFileToUrl('https://s3.mock/presigned-put', 'file:///photo.jpg', 'image/jpeg'),
    ).resolves.toBeUndefined()
  })

  it('throws on a non-2xx status', async () => {
    mockUpload.mockResolvedValue({ status: 403, body: 'Forbidden', headers: {} })
    await expect(
      uploadFileToUrl('https://s3.mock/presigned-put', 'file:///photo.jpg', 'image/jpeg'),
    ).rejects.toThrow(/403/)
  })
})
