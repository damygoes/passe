import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TripCardSkeleton } from './TripCardSkeleton'

const meta: Meta<typeof TripCardSkeleton> = {
  title: 'Trips/TripCardSkeleton',
  component: TripCardSkeleton,
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
type Story = StoryObj<typeof TripCardSkeleton>

export const Default: Story = {}
