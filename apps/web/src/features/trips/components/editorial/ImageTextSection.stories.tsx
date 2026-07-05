import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ImageTextSection } from './ImageTextSection'

const meta: Meta<typeof ImageTextSection> = {
  title: 'Trips/Editorial/ImageTextSection',
  component: ImageTextSection,
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
type Story = StoryObj<typeof ImageTextSection>

const memory = {
  id: 'mem_1',
  note: 'Mint tea and the sound of the souk waking up.',
  city: 'Fes',
  country: 'Morocco',
  capturedAt: '2024-03-06',
  media: [
    { id: 'media_1', url: 'https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=1200&q=80' },
    { id: 'media_2', url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200&q=80' },
  ],
}

export const ImageLeft: Story = {
  args: { memory, side: 'left', photoAlt: 'Memory photo' },
}

export const ImageRight: Story = {
  args: { memory, side: 'right', photoAlt: 'Memory photo' },
}

export const SinglePhoto: Story = {
  args: {
    memory: { ...memory, media: [memory.media[0]!] },
    side: 'left',
    photoAlt: 'Memory photo',
  },
}
