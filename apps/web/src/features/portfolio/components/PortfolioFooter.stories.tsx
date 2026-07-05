import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PortfolioFooter } from './PortfolioFooter'

const meta: Meta<typeof PortfolioFooter> = {
  title: 'Portfolio/PortfolioFooter',
  component: PortfolioFooter,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PortfolioFooter>

export const Default: Story = {}
