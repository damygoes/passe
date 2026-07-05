import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CarouselSection } from './CarouselSection'

const meta: Meta<typeof CarouselSection> = {
  title: 'Trips/Editorial/CarouselSection',
  component: CarouselSection,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[42rem] max-w-full">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof CarouselSection>

export const Default: Story = {
  args: {
    photoAlt: 'Memory photo',
    scrollLeftLabel: 'Scroll left',
    scrollRightLabel: 'Scroll right',
    memory: {
      id: 'mem_1',
      note: 'A full day wandering the medina — every alley led somewhere new.',
      city: 'Marrakech',
      country: 'Morocco',
      capturedAt: '2024-03-07',
      media: [
        { id: 'media_1', url: 'https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=1200&q=80' },
        { id: 'media_2', url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200&q=80' },
        { id: 'media_3', url: 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=1200&q=80' },
      ],
    },
  },
}
