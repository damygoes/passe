import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FinalCtaSection } from './FinalCtaSection'

const meta: Meta<typeof FinalCtaSection> = {
  title: 'Landing/FinalCtaSection',
  component: FinalCtaSection,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FinalCtaSection>

export const Default: Story = {}
