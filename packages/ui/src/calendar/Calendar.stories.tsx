import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import type { DateRange } from 'react-day-picker'
import { Calendar } from './Calendar'

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof Calendar>

function SingleSelect() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-xl ring-1 ring-foreground/10"
    />
  )
}

export const Default: Story = {
  render: () => <SingleSelect />,
}

function RangeSelect() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: undefined,
  })
  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      className="rounded-xl ring-1 ring-foreground/10"
    />
  )
}

export const Range: Story = {
  render: () => <RangeSelect />,
}

export const Disabled: Story = {
  render: () => (
    <Calendar
      mode="single"
      selected={new Date()}
      disabled
      className="rounded-xl ring-1 ring-foreground/10"
    />
  ),
}
