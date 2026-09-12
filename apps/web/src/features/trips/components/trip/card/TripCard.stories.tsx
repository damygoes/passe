import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TripCard } from './TripCard'

const meta: Meta<typeof TripCard> = {
  title: 'Trips/TripCard',
  component: TripCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof TripCard>

export const Default: Story = {
  args: {
    trip: {
      id: 'trip_1',
      title: 'Morocco Roadtrip',
      startDate: '2024-03-02',
      endDate: '2024-03-14',
      coverImageUrl: null,
    },
    cities: ['Marrakesh', 'Fès', 'Chefchaouen'],
    isShared: false,
    href: '/trips/trip_1',
  },
}

export const WithCoverImage: Story = {
  args: {
    trip: {
      id: 'trip_2',
      title: 'Amalfi Coast',
      startDate: '2024-08-10',
      endDate: '2024-08-18',
      coverImageUrl: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&q=80',
    },
    cities: ['Positano', 'Amalfi'],
    isShared: true,
    href: '/trips/trip_2',
  },
}

export const NoLink: Story = {
  args: {
    trip: {
      id: 'trip_3',
      title: 'Balkan Loop',
      startDate: '2023-09-01',
      endDate: '2023-09-20',
      coverImageUrl: null,
    },
    cities: ['Sarajevo', 'Mostar', 'Kotor'],
    isShared: false,
  },
}

export const NoCities: Story = {
  args: {
    trip: {
      id: 'trip_4',
      title: 'Kyoto in Autumn',
      startDate: '2024-11-02',
      endDate: '2024-11-12',
      coverImageUrl: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&q=80',
    },
    cities: [],
    isShared: true,
    href: '/trips/trip_4',
  },
}
