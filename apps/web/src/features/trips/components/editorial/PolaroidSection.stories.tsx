import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PolaroidSection } from './PolaroidSection'

const meta: Meta<typeof PolaroidSection> = {
  title: 'Trips/Editorial/PolaroidSection',
  component: PolaroidSection,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[28rem] max-w-full">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof PolaroidSection>

export const Editorial: Story = {
  args: {
    photoAlt: 'Memory photo',
    memory: {
      id: 'mem_1',
      note: 'First sunrise over the dunes near Merzouga.',
      city: 'Merzouga',
      country: 'Morocco',
      capturedAt: '2024-03-05',
      media: [
        {
          id: 'media_1',
          url: 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=1200&q=80',
        },
      ],
    },
  },
}

export const Scrapbook: Story = {
  args: Editorial.args,
  decorators: [
    (Story) => (
      <div data-theme="scrapbook" className="w-[28rem] max-w-full bg-background p-4">
        <Story />
      </div>
    ),
  ],
}
