import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TestimonialSection } from './TestimonialSection'

const meta: Meta<typeof TestimonialSection> = {
  title: 'Landing/TestimonialSection',
  component: TestimonialSection,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TestimonialSection>

export const Default: Story = {}
