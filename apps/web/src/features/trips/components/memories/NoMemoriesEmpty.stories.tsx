import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { NoMemoriesEmpty } from './NoMemoriesEmpty'

const meta: Meta<typeof NoMemoriesEmpty> = {
  title: 'Trips/NoMemoriesEmpty',
  component: NoMemoriesEmpty,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NoMemoriesEmpty>

export const Default: Story = {
  args: {
    tripId: 'trip_1',
  },
}
