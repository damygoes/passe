import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { MobileMenu } from './MobileMenu'

const meta: Meta<typeof MobileMenu> = {
  title: 'Shared/MobileMenu',
  component: MobileMenu,
  tags: ['autodocs'],
  parameters: {
    // The overlay panel is closed by default — click the hamburger button in the
    // canvas to open it and preview the full-screen menu.
    docs: {
      description: {
        component: 'Click the hamburger button to open the full-screen mobile nav overlay.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof MobileMenu>

export const Default: Story = {
  args: {
    username: 'amara',
  },
}

export const NoPublicPortfolio: Story = {
  args: {
    username: null,
  },
}
