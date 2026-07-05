import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TripDetailHeaderSkeleton } from './TripDetailHeaderSkeleton'

const meta: Meta<typeof TripDetailHeaderSkeleton> = {
  title: 'Trips/TripDetailHeaderSkeleton',
  component: TripDetailHeaderSkeleton,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[36rem] max-w-full">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof TripDetailHeaderSkeleton>

export const Default: Story = {}
