import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../icon/Icon'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './AlertDialog'
import { Button } from '../button/Button'

const meta = {
  title: 'Components/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
} satisfies Meta<typeof AlertDialog>

export default meta
type Story = StoryObj<typeof AlertDialog>

export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline">Delete trip</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this trip?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the trip and all of its memories. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

export const WithMedia: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline">Delete account</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Icon name="alert" />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete account</AlertDialogTitle>
          <AlertDialogDescription>
            Deleting your account removes every trip, memory, and photo you&apos;ve saved. There
            is no way to recover this data afterwards.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete account</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

export const Small: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="ghost">Remove photo</Button>} />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Remove photo?</AlertDialogTitle>
          <AlertDialogDescription>This photo will be removed from the memory.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}
