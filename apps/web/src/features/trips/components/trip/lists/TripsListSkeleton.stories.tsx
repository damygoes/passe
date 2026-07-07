import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TripsListSkeleton } from './TripsListSkeleton'

const meta: Meta<typeof TripsListSkeleton> = {
  title: 'Trips/TripsListSkeleton',
  component: TripsListSkeleton,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TripsListSkeleton>

export const Default: Story = {}
