import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { NoPublicTripsEmpty } from './NoPublicTripsEmpty'

const meta: Meta<typeof NoPublicTripsEmpty> = {
  title: 'Portfolio/NoPublicTripsEmpty',
  component: NoPublicTripsEmpty,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NoPublicTripsEmpty>

export const Default: Story = {
  args: {
    displayName: 'Amara Okafor',
  },
}
