import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ThemeDropdownMenu } from './ThemeDropdownMenu'

const meta: Meta<typeof ThemeDropdownMenu> = {
  title: 'Shared/ThemeDropdownMenu',
  component: ThemeDropdownMenu,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex min-h-24 items-start justify-center pt-4">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ThemeDropdownMenu>

export const LightTheme: Story = {}

export const DarkTheme: Story = {
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
}
