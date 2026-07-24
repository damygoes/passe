import { fireEvent, render, screen } from '@testing-library/react-native'
import { mockReplace, setMockSearchParams } from '@/test/expo-router-mock'
import { TripActionsScreen } from './TripActionsScreen'

const mockDeleteMutate = jest.fn()
jest.mock('@passe/hooks', () => ({
  useDeleteTrip: () => ({ mutate: mockDeleteMutate, isPending: false }),
}))

describe('TripActionsScreen', () => {
  beforeEach(() => {
    setMockSearchParams({ id: 'trip-1' })
  })

  it('renders the three action rows', () => {
    render(<TripActionsScreen />)
    expect(screen.getByText('export_menu_trigger')).toBeTruthy()
    expect(screen.getByText('edit')).toBeTruthy()
    expect(screen.getByText('delete')).toBeTruthy()
  })

  it('opens the export sheet in place of this one', () => {
    render(<TripActionsScreen />)
    fireEvent.press(screen.getByText('export_menu_trigger'))
    expect(mockReplace).toHaveBeenCalledWith('/(app)/trips/export/trip-1')
  })

  it('opens the edit sheet in place of this one', () => {
    render(<TripActionsScreen />)
    fireEvent.press(screen.getByText('edit'))
    expect(mockReplace).toHaveBeenCalledWith('/(app)/trips/edit/trip-1')
  })

  it('asks for confirmation before deleting, then navigates to the trips list', () => {
    mockDeleteMutate.mockImplementation((_id, { onSuccess }) => onSuccess())
    render(<TripActionsScreen />)

    fireEvent.press(screen.getByText('delete'))
    expect(screen.getByText('delete_title')).toBeTruthy()
    expect(mockDeleteMutate).not.toHaveBeenCalled()

    fireEvent.press(screen.getByText('delete_confirm'))
    expect(mockDeleteMutate).toHaveBeenCalledWith('trip-1', expect.anything())
    expect(mockReplace).toHaveBeenCalledWith('/(app)/trips')
  })

  it('shows an error banner when deletion fails', () => {
    mockDeleteMutate.mockImplementation((_id, { onError }) => onError())
    render(<TripActionsScreen />)

    fireEvent.press(screen.getByText('delete'))
    fireEvent.press(screen.getByText('delete_confirm'))
    expect(screen.getByText('delete_failed')).toBeTruthy()
  })
})
