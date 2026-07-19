import { manipulateAsync } from 'expo-image-manipulator'
import { compressImage } from './image-compression'

jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn(),
  SaveFormat: { JPEG: 'jpeg', PNG: 'png', WEBP: 'webp' },
}))

const mockManipulateAsync = manipulateAsync as jest.Mock

beforeEach(() => {
  mockManipulateAsync.mockReset()
  mockManipulateAsync.mockResolvedValue({
    uri: 'file:///compressed.jpg',
    width: 2000,
    height: 1500,
  })
})

describe('compressImage', () => {
  it('resizes when the source exceeds the max dimension', async () => {
    await compressImage({ uri: 'file:///original.jpg', width: 4000, height: 3000 })
    expect(mockManipulateAsync).toHaveBeenCalledWith(
      'file:///original.jpg',
      [{ resize: { width: 2000 } }],
      { compress: 0.8, format: 'jpeg' },
    )
  })

  it('does not resize (or upscale) an image already under the max dimension', async () => {
    mockManipulateAsync.mockResolvedValue({
      uri: 'file:///compressed.jpg',
      width: 800,
      height: 600,
    })
    await compressImage({ uri: 'file:///original.jpg', width: 800, height: 600 })
    expect(mockManipulateAsync).toHaveBeenCalledWith('file:///original.jpg', [], {
      compress: 0.8,
      format: 'jpeg',
    })
  })

  it('returns the resulting uri, contentType, and dimensions', async () => {
    const result = await compressImage({ uri: 'file:///original.jpg', width: 4000, height: 3000 })
    expect(result).toEqual({
      uri: 'file:///compressed.jpg',
      contentType: 'image/jpeg',
      width: 2000,
      height: 1500,
    })
  })
})
