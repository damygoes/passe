import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { NoPublicMemoriesEmpty } from './NoPublicMemoriesEmpty'

const meta: Meta<typeof NoPublicMemoriesEmpty> = {
  title: 'Portfolio/NoPublicMemoriesEmpty',
  component: NoPublicMemoriesEmpty,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NoPublicMemoriesEmpty>

export const Default: Story = {}
