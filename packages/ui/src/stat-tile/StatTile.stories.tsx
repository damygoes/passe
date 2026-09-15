import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatTile } from './StatTile'

const meta = {
  title: 'Components/StatTile',
  component: StatTile,
  tags: ['autodocs'],
  args: {
    value: '47',
    label: 'Cities',
  },
} satisfies Meta<typeof StatTile>

export default meta
type Story = StoryObj<typeof StatTile>

export const Default: Story = {}

export const Surface: Story = {
  args: { tone: 'surface' },
}

export const Sand: Story = {
  args: { tone: 'sand' },
}

export const WithNote: Story = {
  args: { value: '12', label: 'Countries', note: 'Morocco was the twelfth.', size: 'lg' },
}

export const HomeRow: Story = {
  render: () => (
    <div className="flex gap-4">
      <StatTile value="47" label="Cities" tone="surface" />
      <StatTile value="12" label="Countries" tone="surface" />
      <StatTile value="9" label="Trips" tone="sand" />
    </div>
  ),
}
