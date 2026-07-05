import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TextSection } from './TextSection'

const meta: Meta<typeof TextSection> = {
  title: 'Trips/Editorial/TextSection',
  component: TextSection,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[36rem] max-w-full">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof TextSection>

export const Default: Story = {
  args: {
    memory: {
      id: 'mem_1',
      note: 'Some places don’t need a photo to be remembered.',
      city: 'Chefchaouen',
      country: 'Morocco',
      capturedAt: '2024-03-10',
      media: [],
    },
  },
}
