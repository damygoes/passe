import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockPush } from '@/test/navigation-mock'
import { TripForm } from './TripForm'

const mockUseUser = vi.fn()
const mockUseTrips = vi.fn()
const mockCreateTrip = vi.fn()
const mockUpdateTrip = vi.fn()

vi.mock('@passe/hooks', () => ({
  useUser: () => mockUseUser(),
  useTrips: () => mockUseTrips(),
  useCreateTrip: () => ({ mutateAsync: mockCreateTrip, isPending: false }),
  useUpdateTrip: () => ({ mutateAsync: mockUpdateTrip, isPending: false }),
}))

vi.mock('../image-upload/ImageUploadField', () => ({
  ImageUploadField: () => <div>image-upload-field</div>,
}))

vi.mock('../country-tags/CountryTagsInput', () => ({
  CountryTagsInput: ({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) => (
    <button type="button" onClick={() => onChange(['FR'])} data-testid="countries">
      countries:{value.join(',')}
    </button>
  ),
}))

vi.mock('@passe/ui/date-picker', () => ({
  DatePicker: ({ id, value, onChange }: { id?: string; value?: Date; onChange?: (d: Date) => void }) => (
    <button type="button" onClick={() => onChange?.(new Date('2024-01-01'))} data-testid={id}>
      {value?.toISOString() ?? 'unset'}
    </button>
  ),
}))

beforeEach(() => {
  mockUseUser.mockReturnValue({ data: { plan: 'collector' } })
  mockUseTrips.mockReturnValue({ data: [] })
  mockCreateTrip.mockReset()
  mockUpdateTrip.mockReset()
})

describe('TripForm', () => {
  it('shows a validation error on empty submit', async () => {
    const user = userEvent.setup()
    render(<TripForm />)
    await user.click(screen.getByRole('button', { name: 'create' }))
    expect(await screen.findByText('errors.countries_required')).toBeInTheDocument()
  })

  it('shows the plan-limit banner and disables submission at the trip limit', () => {
    mockUseUser.mockReturnValue({ data: { plan: 'free' } })
    mockUseTrips.mockReturnValue({ data: Array.from({ length: 3 }) })
    render(<TripForm />)
    expect(screen.getByText('limit_reached')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'create' })).toBeDisabled()
  })

  it('disables the public toggle for a free-plan user', () => {
    mockUseUser.mockReturnValue({ data: { plan: 'free' } })
    render(<TripForm />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-disabled', 'true')
  })

  it('creates a trip and redirects to it on success', async () => {
    mockCreateTrip.mockResolvedValue({ id: 'trip-1' })
    const user = userEvent.setup()
    render(<TripForm />)

    await user.type(screen.getByLabelText('title_label'), 'Japan Adventure')
    await user.click(screen.getByTestId('countries'))
    await user.click(screen.getByTestId('startDate'))
    await user.click(screen.getByTestId('endDate'))
    await user.click(screen.getByRole('button', { name: 'create' }))

    await waitFor(() => expect(mockCreateTrip).toHaveBeenCalled())
    expect(mockPush).toHaveBeenCalledWith('/trips/trip-1')
  })

  it('shows an error banner when the mutation throws', async () => {
    mockCreateTrip.mockRejectedValue(new Error('network down'))
    const user = userEvent.setup()
    render(<TripForm />)

    await user.type(screen.getByLabelText('title_label'), 'Japan Adventure')
    await user.click(screen.getByTestId('countries'))
    await user.click(screen.getByTestId('startDate'))
    await user.click(screen.getByTestId('endDate'))
    await user.click(screen.getByRole('button', { name: 'create' }))

    expect(await screen.findByText('network down')).toBeInTheDocument()
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
    expect(screen.getByLabelText('title_label')).toHaveValue('Existing Trip')
    expect(screen.getByRole('button', { name: 'save' })).toBeInTheDocument()
  })
})
