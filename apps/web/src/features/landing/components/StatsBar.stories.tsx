import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AsyncServerComponentPreview } from '../../../../.storybook/AsyncServerComponentPreview'
import { StatsBar } from './StatsBar'

function StatsBarPreview() {
  return <AsyncServerComponentPreview component={StatsBar} props={{}} />
}

const meta: Meta<typeof StatsBarPreview> = {
  title: 'Landing/StatsBar',
  component: StatsBarPreview,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StatsBarPreview>

export const Default: Story = {}
