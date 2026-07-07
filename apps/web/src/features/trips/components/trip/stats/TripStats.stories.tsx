import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TripStats } from './TripStats'

const meta: Meta<typeof TripStats> = {
  title: 'Trips/TripStats',
  component: TripStats,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TripStats>

export const Default: Story = {
  args: {
    countriesCount: 12,
    citiesCount: 47,
    yearsCount: 3,
  },
}

export const SingleOfEach: Story = {
  args: {
    countriesCount: 1,
    citiesCount: 1,
    yearsCount: 1,
  },
}

export const Empty: Story = {
  args: {
    countriesCount: 0,
    citiesCount: 0,
    yearsCount: 0,
  },
}
