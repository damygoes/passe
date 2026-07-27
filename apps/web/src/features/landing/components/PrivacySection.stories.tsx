import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PrivacySection } from './PrivacySection'

const meta: Meta<typeof PrivacySection> = {
  title: 'Landing/PrivacySection',
  component: PrivacySection,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PrivacySection>

export const Default: Story = {}
