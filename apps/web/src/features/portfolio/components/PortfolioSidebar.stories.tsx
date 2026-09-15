import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PortfolioSidebar } from './PortfolioSidebar'

const meta: Meta<typeof PortfolioSidebar> = {
  title: 'Portfolio/PortfolioSidebar',
  component: PortfolioSidebar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof PortfolioSidebar>

export const Default: Story = {
  args: {
    user: {
      displayName: 'Amara Okafor',
      bio: 'Chasing sunsets and street food across six continents.',
      avatarUrl: null,
    },
    memberSinceYear: 2019,
    tripCount: 12,
    countriesCount: 8,
    citiesCount: 23,
  },
}

export const NoBio: Story = {
  args: {
    user: {
      displayName: 'Kenji Watanabe',
      bio: null,
      avatarUrl: null,
    },
    memberSinceYear: 2022,
    tripCount: 1,
    countriesCount: 1,
    citiesCount: 1,
  },
}

export const WithAvatar: Story = {
  args: {
    user: {
      displayName: 'Kenji Watanabe',
      bio: 'Slow travel, always.',
      avatarUrl: 'https://i.pravatar.cc/300?img=12',
    },
    memberSinceYear: 2021,
    tripCount: 4,
    countriesCount: 3,
    citiesCount: 9,
  },
}

export const NoPublicTrips: Story = {
  args: {
    user: {
      displayName: 'Amara Okafor',
      bio: null,
      avatarUrl: null,
    },
    memberSinceYear: 2024,
    tripCount: 0,
    countriesCount: 0,
    citiesCount: 0,
  },
}
