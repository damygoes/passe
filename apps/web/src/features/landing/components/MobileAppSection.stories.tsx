import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { MobileAppSection } from './MobileAppSection'

const meta: Meta<typeof MobileAppSection> = {
  title: 'Landing/MobileAppSection',
  component: MobileAppSection,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MobileAppSection>

export const Default: Story = {}
