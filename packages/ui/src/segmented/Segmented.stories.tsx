import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Segmented, SegmentedItem } from './Segmented'

function YearFilterControlled() {
  const [value, setValue] = React.useState('all')
  return (
    <Segmented value={value} onValueChange={(next) => setValue(String(next))}>
      <SegmentedItem value="all">All years</SegmentedItem>
      <SegmentedItem value="2026">2026</SegmentedItem>
      <SegmentedItem value="2025">2025</SegmentedItem>
    </Segmented>
  )
}

const meta = {
  title: 'Components/Segmented',
  component: Segmented,
  tags: ['autodocs'],
} satisfies Meta<typeof Segmented>

export default meta
type Story = StoryObj<typeof Segmented>

export const Default: Story = {
  render: () => (
    <Segmented defaultValue="all">
      <SegmentedItem value="all">All</SegmentedItem>
      <SegmentedItem value="private">Private</SegmentedItem>
      <SegmentedItem value="shared">Shared</SegmentedItem>
    </Segmented>
  ),
}

export const YearFilter: Story = {
  render: () => <YearFilterControlled />,
}
