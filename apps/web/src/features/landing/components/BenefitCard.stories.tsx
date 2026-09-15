import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { BenefitCard } from './BenefitCard'

const meta: Meta<typeof BenefitCard> = {
  title: 'Landing/BenefitCard',
  component: BenefitCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BenefitCard>

export const Terracotta: Story = {
  args: {
    icon: 'lock',
    tone: 'terracotta',
    title: 'Private by default',
    description:
      'Every trip starts closed. Nothing is public, nothing is suggested to strangers, and there is no feed to perform for.',
  },
}

export const Olive: Story = {
  args: {
    icon: 'globe',
    tone: 'olive',
    title: 'A map that fills in',
    description:
      'Cities, countries, the roads between them. Watch the years accumulate into a shape that is only yours.',
  },
}
