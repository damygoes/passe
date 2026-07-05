import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { NavbarUserMenu } from './NavbarUserMenu'

const meta: Meta<typeof NavbarUserMenu> = {
  title: 'Shared/NavbarUserMenu',
  component: NavbarUserMenu,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NavbarUserMenu>

export const Default: Story = {
  args: {
    displayName: 'Amara Okafor',
    email: 'amara@example.com',
    avatarUrl: null,
  },
}

export const WithAvatar: Story = {
  args: {
    displayName: 'Kenji Watanabe',
    email: 'kenji@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
  },
}
