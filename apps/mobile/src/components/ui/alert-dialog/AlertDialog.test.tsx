import { fireEvent, render, screen } from '@testing-library/react-native'
import { useState } from 'react'
import { Text } from 'react-native'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './AlertDialog'

function ControlledDialog({ onConfirm }: { onConfirm?: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Text>Open</Text>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onPress={onConfirm}>Confirm</AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  )
}

describe('AlertDialog', () => {
  it('does not show the dialog content until the trigger is pressed', () => {
    render(<ControlledDialog />)
    expect(screen.queryByText('Are you sure?')).toBeNull()
  })

  it('opens the dialog when the trigger is pressed', () => {
    render(<ControlledDialog />)
    fireEvent.press(screen.getByText('Open'))
    expect(screen.getByText('Are you sure?')).toBeTruthy()
  })

  it('closes the dialog when cancel is pressed', () => {
    render(<ControlledDialog />)
    fireEvent.press(screen.getByText('Open'))
    fireEvent.press(screen.getByText('Cancel'))
    expect(screen.queryByText('Are you sure?')).toBeNull()
  })

  it('calls onPress and closes the dialog when the action is pressed', () => {
    const onConfirm = jest.fn()
    render(<ControlledDialog onConfirm={onConfirm} />)
    fireEvent.press(screen.getByText('Open'))
    fireEvent.press(screen.getByText('Confirm'))
    expect(onConfirm).toHaveBeenCalled()
    expect(screen.queryByText('Are you sure?')).toBeNull()
  })
})
