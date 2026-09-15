import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ProofStrip } from './ProofStrip'

const meta: Meta<typeof ProofStrip> = {
  title: 'Landing/ProofStrip',
  component: ProofStrip,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ProofStrip>

export const Default: Story = {}
