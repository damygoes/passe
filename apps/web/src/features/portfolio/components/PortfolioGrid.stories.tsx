import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PortfolioGrid } from './PortfolioGrid'

const meta: Meta<typeof PortfolioGrid> = {
  title: 'Portfolio/PortfolioGrid',
  component: PortfolioGrid,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PortfolioGrid>

export const Default: Story = {
  args: {
    slug: 'amara',
    displayName: 'Amara Okafor',
    trips: [
      {
        id: 'trip_1',
        title: 'Morocco Roadtrip',
        startDate: '2024-03-02',
        endDate: '2024-03-14',
        countries: ['Morocco'],
        coverImageUrl: null,
      },
      {
        id: 'trip_2',
        title: 'Amalfi Coast',
        startDate: '2024-08-10',
        endDate: '2024-08-18',
        countries: ['Italy'],
        coverImageUrl: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&q=80',
      },
      {
        id: 'trip_3',
        title: 'Kyoto in Autumn',
        startDate: '2023-11-05',
        endDate: '2023-11-15',
        countries: ['Japan'],
        coverImageUrl: null,
      },
    ],
  },
}

export const Empty: Story = {
  args: {
    slug: 'amara',
    displayName: 'Amara Okafor',
    trips: [],
  },
}
