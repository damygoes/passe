import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { NestedQuoteCard } from './NestedQuoteCard'

const meta: Meta<typeof NestedQuoteCard> = {
  title: 'Landing/NestedQuoteCard',
  component: NestedQuoteCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-96 rounded-3xl bg-dark-espresso-dark p-6">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof NestedQuoteCard>

export const Default: Story = {
  args: {
    text: 'I sent my mother a link to Japan and nothing else. That is exactly the amount of sharing I wanted.',
    who: 'Mira · 21 countries',
  },
}
