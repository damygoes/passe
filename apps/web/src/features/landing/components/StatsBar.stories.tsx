import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { StatsBar } from './StatsBar'

const meta: Meta<typeof StatsBar> = {
  title: 'Landing/StatsBar',
  component: StatsBar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StatsBar>

export const Default: Story = {}
