import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    children: 'Badge',
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {}

export const Secondary: Story = {
  args: { variant: 'secondary' },
}

export const Destructive: Story = {
  args: { variant: 'destructive' },
}

export const Outline: Story = {
  args: { variant: 'outline' },
}

export const Ghost: Story = {
  args: { variant: 'ghost' },
}

export const Stamp: Story = {
  args: { variant: 'stamp', children: 'Indonesia' },
}

export const Private: Story = {
  args: { variant: 'private', children: 'Private' },
}

export const Shared: Story = {
  args: { variant: 'shared', children: 'Shared' },
}

export const Neutral: Story = {
  args: { variant: 'neutral', children: 'Golden hour' },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="stamp">Stamp</Badge>
      <Badge variant="private">Private</Badge>
      <Badge variant="shared">Shared</Badge>
      <Badge variant="neutral">Golden hour</Badge>
    </div>
  ),
}
