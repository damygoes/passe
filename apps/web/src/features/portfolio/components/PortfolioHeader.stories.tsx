import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PortfolioHeader } from './PortfolioHeader'

const meta: Meta<typeof PortfolioHeader> = {
  title: 'Portfolio/PortfolioHeader',
  component: PortfolioHeader,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PortfolioHeader>

export const Default: Story = {
  args: {
    username: 'amara',
  },
}
