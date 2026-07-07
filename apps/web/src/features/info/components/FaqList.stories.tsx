import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FaqList } from './FaqList'

const meta: Meta<typeof FaqList> = {
  title: 'Info/FaqList',
  component: FaqList,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FaqList>

export const Default: Story = {
  args: {
    items: [
      {
        question: 'What is Passé?',
        answer:
          'Passé is a travel memory platform. You create trips, attach memories to them, and keep a beautifully organized archive of where you have been.',
      },
      {
        question: 'Who can see my trips and memories?',
        answer: 'Only you, unless you decide otherwise. Everything is private by default.',
      },
    ],
  },
}
