import { act, renderHook } from '@testing-library/react-native'
import { mockBack } from '@/test/expo-router-mock'
import { useAddMemoryWizard, WIZARD_STEP_COUNT } from './useAddMemoryWizard'

const mockUseUser = jest.fn()
const mockUseMemories = jest.fn()
const mockCreateMemory = jest.fn()

jest.mock('@passe/hooks', () => ({
  useUser: () => mockUseUser(),
  useMemories: () => mockUseMemories(),
  useCreateMemory: () => ({ mutateAsync: mockCreateMemory, isPending: false }),
  useUploadImage: () => ({ mutateAsync: jest.fn() }),
}))

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(),
}))

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  reverseGeocodeAsync: jest.fn(),
}))

function setup({ plan = 'free', memoriesCount = 0 } = {}) {
  mockUseUser.mockReturnValue({ data: { plan } })
  mockUseMemories.mockReturnValue({ data: Array.from({ length: memoriesCount }, () => ({})) })
}

describe('useAddMemoryWizard', () => {
  beforeEach(() => {
    mockCreateMemory.mockReset().mockResolvedValue({})
    mockBack.mockClear()
    setup()
  })

  it('starts on step 1', () => {
    const { result } = renderHook(() => useAddMemoryWizard('trip-1'))
    expect(result.current.step).toBe(1)
  })

  it('clamps goToStep within [1, WIZARD_STEP_COUNT]', () => {
    const { result } = renderHook(() => useAddMemoryWizard('trip-1'))
    act(() => result.current.goToStep(0))
    expect(result.current.step).toBe(1)
    act(() => result.current.goToStep(WIZARD_STEP_COUNT + 5))
    expect(result.current.step).toBe(WIZARD_STEP_COUNT)
  })

  it('flags atMemoryLimit once the plan limit is reached', () => {
    setup({ plan: 'free', memoriesCount: 10 })
    const { result } = renderHook(() => useAddMemoryWizard('trip-1'))
    expect(result.current.atMemoryLimit).toBe(true)
  })

  it('refuses to save with neither a photo nor a note, and jumps back to step 1', () => {
    const { result } = renderHook(() => useAddMemoryWizard('trip-1'))
    act(() => result.current.goToStep(3))
    act(() => {
      result.current.handleSave()
    })
    expect(mockCreateMemory).not.toHaveBeenCalled()
    expect(result.current.contentError).toBeTruthy()
    expect(result.current.step).toBe(1)
  })

  it('creates the memory with trimmed fields and parsed tags on save', async () => {
    const { result } = renderHook(() => useAddMemoryWizard('trip-1'))
    act(() => result.current.setNote('  A great day  '))
    act(() => result.current.setCity('  Paris  '))
    act(() => result.current.setTagsInput('Medina,  Golden hour ,, Film'))
    act(() => result.current.setIsPublic(true))

    await act(async () => {
      await result.current.handleSave()
    })

    expect(mockCreateMemory).toHaveBeenCalledWith(
      expect.objectContaining({
        tripId: 'trip-1',
        note: 'A great day',
        city: 'Paris',
        tags: ['Medina', 'Golden hour', 'Film'],
        isPublic: true,
      }),
    )
    expect(mockBack).toHaveBeenCalled()
  })
})
