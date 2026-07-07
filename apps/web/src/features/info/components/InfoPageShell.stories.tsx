import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { InfoPageShell } from './InfoPageShell'

const meta: Meta<typeof InfoPageShell> = {
  title: 'Info/InfoPageShell',
  component: InfoPageShell,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof InfoPageShell>

export const Default: Story = {
  args: {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: 7 July 2026',
    children: <p className="text-sm text-muted-foreground">Page content goes here.</p>,
  },
}

export const WithoutLastUpdated: Story = {
  args: {
    eyebrow: 'Help',
    title: 'Support',
    children: <p className="text-sm text-muted-foreground">Page content goes here.</p>,
  },
}
