import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './Dialog'

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Edit profile</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile here.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="secondary">Cancel</Button>} />
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

// The 880px centered modal used for the Add Memory flow — photo drop on
// the left half, form on the right, over a 45% espresso scrim.
export const ExtraLarge: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button>Add memory</Button>} />
      <DialogContent size="xl">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex min-h-[430px] items-center justify-center rounded-2xl bg-muted text-sm text-muted-foreground">
            drop a photo, or choose from your library
          </div>
          <div>
            <DialogHeader>
              <DialogTitle>New memory</DialogTitle>
              <DialogDescription>Step 2 of 3</DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6">
              <DialogClose render={<Button variant="secondary">Cancel</Button>} />
              <Button>Save to Morocco</Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ),
}
