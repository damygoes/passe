import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { MemoryCardSkeleton } from './MemoryCardSkeleton'

const meta: Meta<typeof MemoryCardSkeleton> = {
  title: 'Trips/MemoryCardSkeleton',
  component: MemoryCardSkeleton,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof MemoryCardSkeleton>

export const Default: Story = {}
