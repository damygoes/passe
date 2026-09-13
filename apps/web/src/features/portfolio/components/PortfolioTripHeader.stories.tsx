import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PortfolioTripHeader } from './PortfolioTripHeader'

const meta: Meta<typeof PortfolioTripHeader> = {
  title: 'Portfolio/PortfolioTripHeader',
  component: PortfolioTripHeader,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PortfolioTripHeader>

export const Default: Story = {
  args: {
    user: { username: 'amara' },
    trip: {
      title: 'Morocco Roadtrip',
      startDate: '2026-03-02',
      countries: ['Morocco'],
    },
    cities: ['Marrakesh', 'Fès', 'Chefchaouen'],
    daysCount: 9,
    sharedMemoriesCount: 11,
    totalMemoriesCount: 24,
  },
}

export const AllShared: Story = {
  args: {
    user: { username: 'kenji' },
    trip: {
      title: 'Kyoto in Autumn',
      startDate: '2024-11-02',
      countries: ['Japan'],
    },
    cities: ['Kyoto'],
    daysCount: 10,
    sharedMemoriesCount: 6,
    totalMemoriesCount: 6,
  },
}
