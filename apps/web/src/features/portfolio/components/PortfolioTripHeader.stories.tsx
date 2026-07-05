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
    slug: 'amara',
    user: { displayName: 'Amara Okafor' },
    trip: {
      title: 'Morocco Roadtrip',
      description: 'Two weeks winding through the Atlas Mountains and the Sahara.',
      countries: ['Morocco'],
    },
  },
}

export const NoDescription: Story = {
  args: {
    slug: 'kenji',
    user: { displayName: 'Kenji Watanabe' },
    trip: {
      title: 'Kyoto in Autumn',
      description: null,
      countries: ['Japan'],
    },
  },
}
