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
  },
}
