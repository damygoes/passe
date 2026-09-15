import { fireEvent, render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'
import { mockBack } from '@/test/expo-router-mock'
import { AccountFormLayout } from './AccountFormLayout'

describe('AccountFormLayout', () => {
  beforeEach(() => {
    mockBack.mockClear()
  })

  it('renders the title, description, and children', () => {
    render(
      <AccountFormLayout title="New memory" description="Add a moment from this trip.">
        <Text>form body</Text>
      </AccountFormLayout>,
    )
    expect(screen.getByText('New memory')).toBeTruthy()
    expect(screen.getByText('Add a moment from this trip.')).toBeTruthy()
    expect(screen.getByText('form body')).toBeTruthy()
  })

  it('navigates back when the close button is pressed', () => {
    render(
      <AccountFormLayout title="New memory">
        <Text>form body</Text>
      </AccountFormLayout>,
    )
    fireEvent.press(screen.getByLabelText('cancel'))
    expect(mockBack).toHaveBeenCalled()
  })

  it('calls the provided onClose instead of router.back() when given', () => {
    const onClose = jest.fn()
    render(
      <AccountFormLayout title="New memory" onClose={onClose}>
        <Text>form body</Text>
      </AccountFormLayout>,
    )
    fireEvent.press(screen.getByLabelText('cancel'))
    expect(onClose).toHaveBeenCalled()
    expect(mockBack).not.toHaveBeenCalled()
  })
})
