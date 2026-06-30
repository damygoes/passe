import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback } from '../avatar/Avatar'
import { Button } from '../button/Button'
import { Icon } from '../icon/Icon'
import amalfiCoastImg from '../assets/amalfi-coast.jpg'
import paellaDishImg from '../assets/paella-dish.jpg'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './Card'

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Trip to Kyoto</CardTitle>
        <CardDescription>March 2024 · Japan</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Cherry blossoms lined the canal paths at Maruyama Park.
        </p>
      </CardContent>
    </Card>
  ),
}

export const Small: Story = {
  render: () => (
    <Card size="sm" className="w-72">
      <CardHeader>
        <CardTitle>Weekend in Lisbon</CardTitle>
        <CardDescription>October 2023 · Portugal</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Pastéis de nata and cobblestone streets.</p>
      </CardContent>
    </Card>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Summer in Barcelona</CardTitle>
        <CardDescription>July 2024 · Spain</CardDescription>
        <CardAction>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            Public
          </span>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Gaudí architecture and beach sunsets.</p>
      </CardContent>
    </Card>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Autumn in Kyoto</CardTitle>
        <CardDescription>November 2023 · Japan</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Maple leaves turned crimson across the temple grounds.
        </p>
      </CardContent>
      <CardFooter>
        <span className="text-xs text-muted-foreground">3 memories · 2 countries</span>
      </CardFooter>
    </Card>
  ),
}

export const AllParts: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Road Trip — Pacific Coast</CardTitle>
        <CardDescription>August 2024 · United States</CardDescription>
        <CardAction>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            Explorer
          </span>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Highway 1 from Big Sur to San Francisco — fog-draped cliffs and elephant seal colonies.
        </p>
      </CardContent>
      <CardFooter>
        <span className="text-xs text-muted-foreground">12 memories · 1 country</span>
      </CardFooter>
    </Card>
  ),
}

export const WithTopImage: Story = {
  render: () => (
    <Card className="w-72">
      <img
        src={amalfiCoastImg}
        alt="Amalfi Coast cliffside view"
      />
      <CardHeader>
        <CardTitle>Amalfi Coast</CardTitle>
        <CardDescription>
          Cliffside villages, lemon groves, and turquoise water stretching all the way to the
          horizon — southern Italy at its most dramatic.
        </CardDescription>
      </CardHeader>
      <CardFooter className="border-0 bg-transparent gap-2">
        <Button variant="ghost" size="sm">
          Share
        </Button>
        <Button variant="ghost" size="sm">
          View trip
        </Button>
      </CardFooter>
    </Card>
  ),
}

export const WithAvatarAndMedia: Story = {
  render: () => (
    <Card className="w-72">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar size="sm">
            <AvatarFallback>R</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle>Shrimp and Chorizo Paella</CardTitle>
            <p className="text-sm text-muted-foreground">September 14, 2016</p>
          </div>
        </div>
        <CardAction>
          <Button variant="ghost" size="icon-sm">
            <Icon name="chevronDown" />
          </Button>
        </CardAction>
      </CardHeader>
      <img
        src={paellaDishImg}
        alt="Shrimp and chorizo paella dish"
      />
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This impressive paella is a perfect party dish and a fun meal to cook together with your
          guests. Add 1 cup of frozen peas along with the mussels, if you like.
        </p>
      </CardContent>
      <CardFooter className="border-0 bg-transparent gap-2">
        <Button variant="ghost" size="icon-sm">
          <Icon name="alert" />
        </Button>
        <Button variant="ghost" size="icon-sm">
          <Icon name="arrow-right" />
        </Button>
        <div className="ml-auto">
          <Button variant="ghost" size="icon-sm">
            <Icon name="chevronDown" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  ),
}
