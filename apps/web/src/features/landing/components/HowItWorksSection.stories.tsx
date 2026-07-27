import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { HowItWorksSection } from './HowItWorksSection'

const meta: Meta<typeof HowItWorksSection> = {
  title: 'Landing/HowItWorksSection',
  component: HowItWorksSection,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof HowItWorksSection>

export const Default: Story = {}
