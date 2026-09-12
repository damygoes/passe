import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback } from '../avatar/Avatar'
import { Button } from '../button/Button'
import { Navbar, NavbarBrand, NavbarLinks, NavbarUser } from './Navbar'

const meta = {
  title: 'Components/Navbar',
  component: Navbar,
  tags: ['autodocs'],
} satisfies Meta<typeof Navbar>

export default meta
type Story = StoryObj<typeof Navbar>

export const Default: Story = {
  render: () => (
    <Navbar>
      <NavbarBrand>
        <span className="text-base font-semibold tracking-tight">Passe</span>
      </NavbarBrand>
      <NavbarLinks>
        <Button variant="ghost" size="sm">
          Dashboard
        </Button>
        <Button variant="ghost" size="sm">
          My Portfolio
        </Button>
      </NavbarLinks>
      <NavbarUser>
        <Avatar size="sm">
          <AvatarFallback>D</AvatarFallback>
        </Avatar>
      </NavbarUser>
    </Navbar>
  ),
}
