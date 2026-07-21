import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PortfolioHeader } from './PortfolioHeader'

const meta: Meta<typeof PortfolioHeader> = {
  title: 'Portfolio/PortfolioHeader',
  component: PortfolioHeader,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PortfolioHeader>

export const Default: Story = {
  args: {
    user: {
      displayName: 'Amara Okafor',
      bio: 'Chasing sunsets and street food across six continents.',
      avatarUrl: null,
    },
    tripCount: 12,
    countriesCount: 8,
    citiesCount: 23,
    yearsCount: 4,
  },
}

export const NoBio: Story = {
  args: {
    user: {
      displayName: 'Kenji Watanabe',
      bio: null,
      avatarUrl: null,
    },
    tripCount: 1,
    countriesCount: 1,
    citiesCount: 1,
    yearsCount: 1,
  },
}

export const WithAvatar: Story = {
  args: {
    user: {
      displayName: 'Kenji Watanabe',
      bio: 'Slow travel, always.',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
    },
    tripCount: 4,
    countriesCount: 3,
    citiesCount: 9,
    yearsCount: 2,
  },
}

export const NoPublicTrips: Story = {
  args: {
    user: {
      displayName: 'Amara Okafor',
      bio: null,
      avatarUrl: null,
    },
    tripCount: 0,
    countriesCount: 0,
    citiesCount: 0,
    yearsCount: 0,
  },
}
