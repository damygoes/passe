import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { NoTripsEmpty } from './NoTripsEmpty'

const meta: Meta<typeof NoTripsEmpty> = {
  title: 'Trips/NoTripsEmpty',
  component: NoTripsEmpty,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NoTripsEmpty>

export const Default: Story = {}
