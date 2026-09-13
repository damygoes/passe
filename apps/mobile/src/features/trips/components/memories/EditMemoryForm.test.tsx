import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import type { Memory } from '@passe/types/memory'
import { EditMemoryForm } from './EditMemoryForm'

const mockUpdateMemory = jest.fn()
const mockUploadMutateAsync = jest.fn()

jest.mock('@passe/hooks', () => ({
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
  placeName: null,
  tags: ['Golden hour'],
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
  mockUpdateMemory.mockClear()
})

describe('EditMemoryForm', () => {
  it('pre-fills fields, including tags, from the existing memory', () => {
    render(<EditMemoryForm tripId="trip-1" memory={existingMemory} />)
    expect(screen.getByPlaceholderText('note_placeholder')).toHaveProp('value', 'Great day')
    expect(screen.getByPlaceholderText('city_placeholder')).toHaveProp('value', 'Paris')
    expect(screen.getByPlaceholderText('country_placeholder')).toHaveProp('value', 'France')
    expect(screen.getByPlaceholderText('tags_placeholder')).toHaveProp('value', 'Golden hour')
    expect(screen.getByText('save')).toBeTruthy()
  })

  it('shows a validation error when submitting with no note and no photos', async () => {
    render(<EditMemoryForm tripId="trip-1" memory={{ ...existingMemory, note: null }} />)
    fireEvent.changeText(screen.getByPlaceholderText('note_placeholder'), '')
    fireEvent.press(screen.getByText('save'))
    expect(await screen.findByText('errors.content_required')).toBeTruthy()
    expect(mockUpdateMemory).not.toHaveBeenCalled()
  })

  it('updates a memory with trimmed tags and navigates back on success', async () => {
    mockUpdateMemory.mockResolvedValue({ id: 'memory-1' })
    render(<EditMemoryForm tripId="trip-1" memory={existingMemory} />)

    fireEvent.changeText(screen.getByPlaceholderText('note_placeholder'), 'Updated note')
    fireEvent.changeText(screen.getByPlaceholderText('tags_placeholder'), 'Medina,  Film ')
    fireEvent.press(screen.getByText('save'))

    await waitFor(() => expect(mockUpdateMemory).toHaveBeenCalled())
    expect(mockUpdateMemory).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'memory-1',
        tripId: 'trip-1',
        note: 'Updated note',
        tags: ['Medina', 'Film'],
        isPublic: false,
      }),
    )
  })

  it('toggles the memory public via the privacy switch', async () => {
    mockUpdateMemory.mockResolvedValue({ id: 'memory-1' })
    render(<EditMemoryForm tripId="trip-1" memory={existingMemory} />)

    fireEvent.press(screen.getByRole('switch'))
    fireEvent.press(screen.getByText('save'))

    await waitFor(() => expect(mockUpdateMemory).toHaveBeenCalled())
    expect(mockUpdateMemory).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'memory-1', isPublic: true }),
    )
  })

  it('shows an error banner when the mutation throws', async () => {
    mockUpdateMemory.mockRejectedValue(new Error('network down'))
    render(<EditMemoryForm tripId="trip-1" memory={existingMemory} />)

    fireEvent.press(screen.getByText('save'))
    expect(await screen.findByText('network down')).toBeTruthy()
  })

  it('geolocates and fills city/country via reverse geocoding', async () => {
    const Location = require('expo-location')
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' })
    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: 48.8, longitude: 2.3 },
    })
    Location.reverseGeocodeAsync.mockResolvedValue([{ city: 'Paris', country: 'France' }])

    render(<EditMemoryForm tripId="trip-1" memory={existingMemory} />)
    fireEvent.press(screen.getByText('use_current_location'))

    await waitFor(() =>
      expect(screen.getByPlaceholderText('city_placeholder')).toHaveProp('value', 'Paris'),
    )
    expect(screen.getByPlaceholderText('country_placeholder')).toHaveProp('value', 'France')
  })
})
