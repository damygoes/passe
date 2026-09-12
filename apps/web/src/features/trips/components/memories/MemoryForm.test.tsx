import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockPush } from '@/test/navigation-mock'
import { MemoryForm } from './MemoryForm'

const mockUseUser = vi.fn()
const mockUseTrip = vi.fn()
const mockUseMemories = vi.fn()
const mockCreateMemory = vi.fn()
const mockUpdateMemory = vi.fn()
const mockReverseGeocode = vi.fn()

vi.mock('@passe/hooks', () => ({
  useUser: () => mockUseUser(),
  useTrip: () => mockUseTrip(),
  useMemories: () => mockUseMemories(),
  useCreateMemory: () => ({ mutateAsync: mockCreateMemory, isPending: false }),
  useUpdateMemory: () => ({ mutateAsync: mockUpdateMemory, isPending: false }),
  useReverseGeocode: () => ({ mutateAsync: mockReverseGeocode }),
}))

vi.mock('./MemoryPhotosField', () => ({
  MemoryPhotosField: ({ photos }: { photos: unknown[] }) => <div>photos:{photos.length}</div>,
}))

vi.mock('@passe/ui/date-picker', () => ({
  DatePicker: ({ value }: { value?: Date }) => (
    <div data-testid="date-picker">{value?.toISOString() ?? ''}</div>
  ),
}))

beforeEach(() => {
  mockUseUser.mockReturnValue({ data: { plan: 'collector' } })
  mockUseTrip.mockReturnValue({ data: undefined })
  mockUseMemories.mockReturnValue({ data: [] })
  mockCreateMemory.mockReset()
  mockUpdateMemory.mockReset()
  mockReverseGeocode.mockReset()
})

describe('MemoryForm', () => {
  it('shows a validation error when submitting with no note and no photos', async () => {
    const user = userEvent.setup()
    render(<MemoryForm tripId="trip-1" />)
    await user.click(screen.getByRole('button', { name: 'create' }))
    expect(await screen.findByText('errors.content_required')).toBeInTheDocument()
    expect(mockCreateMemory).not.toHaveBeenCalled()
  })

  it('shows the plan-limit banner and disables submission when at the memory limit', () => {
    mockUseUser.mockReturnValue({ data: { plan: 'free' } })
    mockUseMemories.mockReturnValue({ data: Array.from({ length: 10 }) })
    render(<MemoryForm tripId="trip-1" />)
    expect(screen.getByText('limit_reached')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'create' })).toBeDisabled()
  })

  it('creates a memory and redirects to the trip page on success', async () => {
    mockCreateMemory.mockResolvedValue({ id: 'memory-1' })
    const user = userEvent.setup()
    render(<MemoryForm tripId="trip-1" />)

    await user.type(screen.getByLabelText('note_label'), 'Great day')
    await user.click(screen.getByRole('button', { name: 'create' }))

    await waitFor(() => expect(mockCreateMemory).toHaveBeenCalled())
    expect(mockCreateMemory).toHaveBeenCalledWith(
      expect.objectContaining({ tripId: 'trip-1', note: 'Great day', isPublic: false, tags: [] }),
    )
    expect(mockPush).toHaveBeenCalledWith('/trips/trip-1')
  })

  it('defaults the privacy toggle to private and lets it be switched on', async () => {
    mockCreateMemory.mockResolvedValue({ id: 'memory-1' })
    const user = userEvent.setup()
    render(<MemoryForm tripId="trip-1" />)

    expect(screen.getByRole('switch')).toHaveAttribute('data-checked')

    await user.click(screen.getByRole('switch'))
    await user.type(screen.getByLabelText('note_label'), 'Great day')
    await user.click(screen.getByRole('button', { name: 'create' }))

    await waitFor(() => expect(mockCreateMemory).toHaveBeenCalled())
    expect(mockCreateMemory).toHaveBeenCalledWith(expect.objectContaining({ isPublic: true }))
  })

  it('parses the comma-separated tags input', async () => {
    mockCreateMemory.mockResolvedValue({ id: 'memory-1' })
    const user = userEvent.setup()
    render(<MemoryForm tripId="trip-1" />)

    await user.type(screen.getByLabelText('note_label'), 'Great day')
    await user.type(screen.getByLabelText('tags_label'), 'Medina, Golden hour ,  Film')
    await user.click(screen.getByRole('button', { name: 'create' }))

    await waitFor(() => expect(mockCreateMemory).toHaveBeenCalled())
    expect(mockCreateMemory).toHaveBeenCalledWith(
      expect.objectContaining({ tags: ['Medina', 'Golden hour', 'Film'] }),
    )
  })

  it('shows an error banner when the mutation throws', async () => {
    mockCreateMemory.mockRejectedValue(new Error('network down'))
    const user = userEvent.setup()
    render(<MemoryForm tripId="trip-1" />)

    await user.type(screen.getByLabelText('note_label'), 'Great day')
    await user.click(screen.getByRole('button', { name: 'create' }))

    expect(await screen.findByText('network down')).toBeInTheDocument()
  })

  it('geolocates and fills city/country via reverse geocoding', async () => {
    const getCurrentPosition = vi.fn((success: PositionCallback) =>
      success({ coords: { latitude: 48.8, longitude: 2.3 } } as GeolocationPosition),
    )
    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } })
    mockReverseGeocode.mockResolvedValue({
      city: 'Paris',
      country: 'France',
      placeName: 'Paris, France',
    })

    const user = userEvent.setup()
    render(<MemoryForm tripId="trip-1" />)
    await user.click(screen.getByRole('button', { name: /use_current_location/ }))

    await waitFor(() => expect(screen.getByLabelText('city_label')).toHaveValue('Paris'))
    expect(screen.getByLabelText('country_label')).toHaveValue('France')
    expect(screen.getByLabelText('place_name_label')).toHaveValue('Paris, France')

    vi.unstubAllGlobals()
  })

  it('pre-fills fields when editing an existing memory', () => {
    render(
      <MemoryForm
        tripId="trip-1"
        memory={{
          id: 'memory-1',
          tripId: 'trip-1',
          userId: 'user-1',
          note: 'Existing note',
          media: [],
          location: null,
          city: 'Kyoto',
          country: 'Japan',
          placeName: null,
          tags: [],
          capturedAt: new Date('2024-03-02'),
          isPublic: false,
          layoutVariant: 'auto',
          sortOrder: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }}
      />,
    )
    expect(screen.getByLabelText('note_label')).toHaveValue('Existing note')
    expect(screen.getByLabelText('city_label')).toHaveValue('Kyoto')
    expect(screen.getByRole('button', { name: 'save' })).toBeInTheDocument()
  })
})
