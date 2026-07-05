import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { HeroSection } from './HeroSection'

const meta: Meta<typeof HeroSection> = {
  title: 'Trips/Editorial/HeroSection',
  component: HeroSection,
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
type Story = StoryObj<typeof HeroSection>

export const Default: Story = {
  args: {
    photoAlt: 'Memory photo',
    memory: {
      id: 'mem_1',
      note: 'First sunrise over the dunes near Merzouga.',
      city: 'Merzouga',
      country: 'Morocco',
      capturedAt: '2024-03-05',
      media: [{ id: 'media_1', url: 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=1200&q=80' }],
    },
  },
}

export const NoNote: Story = {
  args: {
    photoAlt: 'Memory photo',
    memory: {
      id: 'mem_2',
      note: null,
      city: 'Marrakech',
      country: 'Morocco',
      capturedAt: '2024-03-08',
      media: [{ id: 'media_2', url: 'https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=1200&q=80' }],
    },
  },
}
