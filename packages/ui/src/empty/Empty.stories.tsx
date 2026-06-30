import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button/Button'
import { Icon } from '../icon/Icon'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from './Empty'

const meta = {
  title: 'Components/Empty',
  component: Empty,
  tags: ['autodocs'],
} satisfies Meta<typeof Empty>

export default meta
type Story = StoryObj<typeof Empty>

export const Default: Story = {
  render: () => (
    <Empty className="h-48 border">
      <EmptyHeader>
        <EmptyTitle>No trips yet</EmptyTitle>
        <EmptyDescription>Your travel memories will appear here once you add your first trip.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <Empty className="h-56 border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon name="alert" />
        </EmptyMedia>
        <EmptyTitle>No memories found</EmptyTitle>
        <EmptyDescription>Try adjusting your filters or add a new memory to this trip.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
}

export const WithContent: Story = {
  render: () => (
    <Empty className="h-56 border">
      <EmptyHeader>
        <EmptyTitle>No trips yet</EmptyTitle>
        <EmptyDescription>Start by creating your first trip and attaching memories to it.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Create a trip</Button>
      </EmptyContent>
    </Empty>
  ),
}

export const Full: Story = {
  render: () => (
    <Empty className="h-64 border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon name="alert" />
        </EmptyMedia>
        <EmptyTitle>No memories found</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t added any memories to this trip yet. Attach photos and notes to bring it to life.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Add a memory</Button>
        <Button variant="ghost" size="sm">Learn more</Button>
      </EmptyContent>
    </Empty>
  ),
}
