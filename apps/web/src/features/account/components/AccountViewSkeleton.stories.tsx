import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AccountViewSkeleton } from './AccountViewSkeleton'

const meta: Meta<typeof AccountViewSkeleton> = {
  title: 'Account/AccountViewSkeleton',
  component: AccountViewSkeleton,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof AccountViewSkeleton>

export const Default: Story = {}
