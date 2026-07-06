import { fireEvent, render, screen } from '@testing-library/react-native'
import { TouchableOpacity } from 'react-native'
import { Input } from './Input'

describe('Input', () => {
  it('calls onChangeText as the user types', () => {
    const onChangeText = jest.fn()
    render(<Input placeholder="Email" onChangeText={onChangeText} />)
    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'user@example.com')
    expect(onChangeText).toHaveBeenCalledWith('user@example.com')
  })

  it('calls onIconPress when the icon is pressed', () => {
    const onIconPress = jest.fn()
    render(<Input placeholder="Password" icon="eye" onIconPress={onIconPress} />)
    fireEvent.press(screen.UNSAFE_getByType(TouchableOpacity))
    expect(onIconPress).toHaveBeenCalled()
  })

  it('is not editable when editable is false', () => {
    render(<Input placeholder="Email" editable={false} />)
    expect(screen.getByPlaceholderText('Email').props.editable).toBe(false)
  })

  it('shows a loading indicator instead of the icon when isLoading', () => {
    render(<Input placeholder="Email" icon="mail" isLoading />)
    expect(screen.UNSAFE_queryAllByType(TouchableOpacity)).toHaveLength(0)
  })
})
