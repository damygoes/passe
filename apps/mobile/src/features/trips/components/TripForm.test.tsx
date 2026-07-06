import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import { mockPush, mockReplace } from '@/test/expo-router-mock'
import { TripForm } from './TripForm'

const mockUseUser = jest.fn()
const mockUseTrips = jest.fn()
const mockCreateTrip = jest.fn()
const mockUpdateTrip = jest.fn()

jest.mock('@passe/hooks', () => ({
  useUser: () => mockUseUser(),
  useTrips: () => mockUseTrips(),
  useCreateTrip: () => ({ mutateAsync: mockCreateTrip, isPending: false }),
  useUpdateTrip: () => ({ mutateAsync: mockUpdateTrip, isPending: false }),
}))

jest.mock('./CoverImagePicker', () => {
  const { Text } = require('react-native')
  return { CoverImagePicker: () => <Text>cover-image-picker</Text> }
})

jest.mock('./CountryTagsInput', () => {
  const { Text, TouchableOpacity } = require('react-native')
  return {
    CountryTagsInput: ({ onChange }: { onChange: (v: string[]) => void }) => (
      <TouchableOpacity onPress={() => onChange(['FR'])}>
        <Text>countries-input</Text>
      </TouchableOpacity>
    ),
  }
})

jest.mock('./DateField', () => {
  const { Text, TouchableOpacity } = require('react-native')
  return {
    DateField: ({ label, onChange }: { label: string; onChange: (d: Date) => void }) => (
      <TouchableOpacity onPress={() => onChange(new Date('2024-01-01'))}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
  }
})

beforeEach(() => {
  mockUseUser.mockReturnValue({ data: { plan: 'collector' } })
  mockUseTrips.mockReturnValue({ data: [] })
})

async function fillRequiredFields() {
  fireEvent.changeText(screen.getByPlaceholderText('title_placeholder'), 'Japan Adventure')
  fireEvent.press(screen.getByText('countries-input'))
  fireEvent.press(screen.getByText('start_date_label'))
  fireEvent.press(screen.getByText('end_date_label'))
}

describe('TripForm', () => {
  it('shows the plan-limit banner and disables submission at the trip limit', () => {
    mockUseUser.mockReturnValue({ data: { plan: 'free' } })
    mockUseTrips.mockReturnValue({ data: [{}, {}, {}] })
    render(<TripForm />)
    expect(screen.getByText('limit_reached')).toBeTruthy()
  })

  it('disables the public switch for a free-plan user', () => {
    mockUseUser.mockReturnValue({ data: { plan: 'free' } })
    render(<TripForm />)
    expect(screen.getByRole('switch').props.disabled).toBe(true)
  })

  it('creates a trip and navigates to it on success', async () => {
    mockCreateTrip.mockResolvedValue({ id: 'trip-1' })
    render(<TripForm />)

    await fillRequiredFields()
    fireEvent.press(screen.getByText('create'))

    await waitFor(() => expect(mockCreateTrip).toHaveBeenCalled())
    expect(mockReplace).toHaveBeenCalledWith('/(app)/trips/trip-1')
  })

  it('shows an error banner when the mutation throws', async () => {
    mockCreateTrip.mockRejectedValue(new Error('network down'))
    render(<TripForm />)

    await fillRequiredFields()
    fireEvent.press(screen.getByText('create'))

    expect(await screen.findByText('network down')).toBeTruthy()
  })

  it('pre-fills fields and shows "save" when editing an existing trip', () => {
    render(
      <TripForm
        trip={{
          id: 'trip-1',
          userId: 'user-1',
          title: 'Existing Trip',
          description: null,
          coverImageUrl: null,
          countries: ['FR'],
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-05'),
          isPublic: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }}
      />,
    )
    expect(screen.getByDisplayValue('Existing Trip')).toBeTruthy()
    expect(screen.getByText('save')).toBeTruthy()
  })

  it('navigates to account when the upgrade CTA is tapped at the limit', () => {
    mockUseUser.mockReturnValue({ data: { plan: 'free' } })
    mockUseTrips.mockReturnValue({ data: [{}, {}, {}] })
    render(<TripForm />)
    fireEvent.press(screen.getByText('upgrade_cta'))
    expect(mockPush).toHaveBeenCalledWith('/(app)/account')
  })
})
