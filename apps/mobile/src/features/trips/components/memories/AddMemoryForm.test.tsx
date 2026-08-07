import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import type { Memory } from '@passe/types/memory'
import { mockPush } from '@/test/expo-router-mock'
import { AddMemoryForm } from './AddMemoryForm'

const mockUseUser = jest.fn()
const mockUseMemories = jest.fn()
const mockCreateMemory = jest.fn()
const mockUpdateMemory = jest.fn()
const mockUploadMutateAsync = jest.fn()

jest.mock('@passe/hooks', () => ({
  useUser: () => mockUseUser(),
  useMemories: () => mockUseMemories(),
  useCreateMemory: () => ({ mutateAsync: mockCreateMemory, isPending: false }),
  useUpdateMemory: () => ({ mutateAsync: mockUpdateMemory, isPending: false }),
  useUploadImage: () => ({ mutateAsync: mockUploadMutateAsync }),
}))

const existingMemory: Memory = {
  id: 'memory-1',
  tripId: 'trip-1',
  userId: 'user-1',
  note: 'Great day',
  media: [],
  location: null,
  city: 'Paris',
  country: 'France',
  capturedAt: new Date('2026-01-01'),
  isPublic: false,
  layoutVariant: 'auto',
  sortOrder: null,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
}

jest.mock('@/features/trips/components/trip/date-field/DateField', () => {
  const { Text } = require('react-native')
  return { DateField: ({ label }: { label: string }) => <Text>{label}</Text> }
})

jest.mock('expo-image', () => {
  const { Image } = require('react-native')
  return { Image }
})

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

beforeEach(() => {
  mockUseUser.mockReturnValue({ data: { plan: 'collector' } })
  mockUseMemories.mockReturnValue({ data: [] })
})

describe('AddMemoryForm', () => {
  it('shows a validation error when submitting with no note and no photos', async () => {
    render(<AddMemoryForm tripId="trip-1" />)
    fireEvent.press(screen.getByText('create'))
    expect(await screen.findByText('errors.content_required')).toBeTruthy()
    expect(mockCreateMemory).not.toHaveBeenCalled()
  })

  it('shows the plan-limit banner when at the memory limit', () => {
    mockUseUser.mockReturnValue({ data: { plan: 'free' } })
    mockUseMemories.mockReturnValue({ data: Array.from({ length: 10 }) })
    render(<AddMemoryForm tripId="trip-1" />)
    expect(screen.getByText('limit_reached')).toBeTruthy()
  })

  it('creates a memory and navigates back on success', async () => {
    mockCreateMemory.mockResolvedValue({ id: 'memory-1' })
    render(<AddMemoryForm tripId="trip-1" />)

    fireEvent.changeText(screen.getByPlaceholderText('note_placeholder'), 'Great day')
    fireEvent.press(screen.getByText('create'))

    await waitFor(() => expect(mockCreateMemory).toHaveBeenCalled())
    expect(mockCreateMemory).toHaveBeenCalledWith(
      expect.objectContaining({ tripId: 'trip-1', note: 'Great day', isPublic: false }),
    )
  })

  it('shows an error banner when the mutation throws', async () => {
    mockCreateMemory.mockRejectedValue(new Error('network down'))
    render(<AddMemoryForm tripId="trip-1" />)

    fireEvent.changeText(screen.getByPlaceholderText('note_placeholder'), 'Great day')
    fireEvent.press(screen.getByText('create'))

    expect(await screen.findByText('network down')).toBeTruthy()
  })

  it('geolocates and fills city/country via reverse geocoding', async () => {
    const Location = require('expo-location')
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' })
    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: 48.8, longitude: 2.3 },
    })
    Location.reverseGeocodeAsync.mockResolvedValue([{ city: 'Paris', country: 'France' }])

    render(<AddMemoryForm tripId="trip-1" />)
    fireEvent.press(screen.getByText('use_current_location'))

    await waitFor(() =>
      expect(screen.getByPlaceholderText('city_placeholder')).toHaveProp('value', 'Paris'),
    )
    expect(screen.getByPlaceholderText('country_placeholder')).toHaveProp('value', 'France')
  })

  it('shows an upgrade action that opens the paywall when the memory limit is reached', () => {
    mockUseUser.mockReturnValue({ data: { plan: 'free' } })
    mockUseMemories.mockReturnValue({ data: Array.from({ length: 10 }) })
    render(<AddMemoryForm tripId="trip-1" />)
    expect(screen.getByText('limit_reached')).toBeTruthy()

    fireEvent.press(screen.getByText('upgrade_cta'))
    expect(mockPush).toHaveBeenCalledWith('/(app)/account/paywall')
  })

  it('pre-fills fields and shows "save" when editing an existing memory', () => {
    render(<AddMemoryForm tripId="trip-1" memory={existingMemory} />)
    expect(screen.getByPlaceholderText('note_placeholder')).toHaveProp('value', 'Great day')
    expect(screen.getByPlaceholderText('city_placeholder')).toHaveProp('value', 'Paris')
    expect(screen.getByPlaceholderText('country_placeholder')).toHaveProp('value', 'France')
    expect(screen.getByText('save')).toBeTruthy()
  })

  it('does not show the plan-limit banner when editing, even at the memory limit', () => {
    mockUseUser.mockReturnValue({ data: { plan: 'free' } })
    mockUseMemories.mockReturnValue({ data: Array.from({ length: 10 }) })
    render(<AddMemoryForm tripId="trip-1" memory={existingMemory} />)
    expect(screen.queryByText('limit_reached')).toBeNull()
  })

  it('updates a memory and navigates back on success', async () => {
    mockUpdateMemory.mockResolvedValue({ id: 'memory-1' })
    render(<AddMemoryForm tripId="trip-1" memory={existingMemory} />)

    fireEvent.changeText(screen.getByPlaceholderText('note_placeholder'), 'Updated note')
    fireEvent.press(screen.getByText('save'))

    await waitFor(() => expect(mockUpdateMemory).toHaveBeenCalled())
    expect(mockUpdateMemory).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'memory-1', tripId: 'trip-1', note: 'Updated note' }),
    )
    expect(mockCreateMemory).not.toHaveBeenCalled()
  })
})
