import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FeaturesSection } from './FeaturesSection'

const meta: Meta<typeof FeaturesSection> = {
  title: 'Landing/FeaturesSection',
  component: FeaturesSection,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FeaturesSection>

export const Default: Story = {}
