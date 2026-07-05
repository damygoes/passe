import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { MemoriesListSkeleton } from './MemoriesListSkeleton'

const meta: Meta<typeof MemoriesListSkeleton> = {
  title: 'Trips/MemoriesListSkeleton',
  component: MemoriesListSkeleton,
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
type Story = StoryObj<typeof MemoriesListSkeleton>

export const Default: Story = {}
