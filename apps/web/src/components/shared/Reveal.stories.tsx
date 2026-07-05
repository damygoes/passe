import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Reveal } from './Reveal'

const meta: Meta<typeof Reveal> = {
  title: 'Shared/Reveal',
  component: Reveal,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Reveal>

function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex h-32 w-64 items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
      {label}
    </div>
  )
}

export const Up: Story = {
  args: {
    direction: 'up',
    children: <Placeholder label="Reveals from below" />,
  },
}

export const Left: Story = {
  args: {
    direction: 'left',
    children: <Placeholder label="Reveals from the left" />,
  },
}

export const Right: Story = {
  args: {
    direction: 'right',
    children: <Placeholder label="Reveals from the right" />,
  },
}

export const Delayed: Story = {
  args: {
    direction: 'up',
    delay: 300,
    children: <Placeholder label="Delayed 300ms" />,
  },
}
