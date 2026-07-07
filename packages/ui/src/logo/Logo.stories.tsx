import type { Meta, StoryObj } from '@storybook/react-vite'
import { Logo } from './Logo'

const meta: Meta<typeof Logo> = {
  title: 'Components/Logo',
  component: Logo,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Logo>

export const Wordmark: Story = {
  args: { className: 'h-10 w-auto' },
}

export const Mark: Story = {
  args: { variant: 'mark', className: 'h-10 w-auto' },
}

export const OnDark: Story = {
  args: { className: 'h-10 w-auto' },
  decorators: [
    (Story) => (
      <div className="bg-dark-espresso text-aged-cream rounded-lg p-8">
        <Story />
      </div>
    ),
  ],
}

export const NavbarSize: Story = {
  args: { className: 'h-6 w-auto' },
}
