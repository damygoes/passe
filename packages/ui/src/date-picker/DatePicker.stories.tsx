import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { DatePicker } from './DatePicker'

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
}

export default meta
type Story = StoryObj<typeof DatePicker>

function Controlled(args: React.ComponentProps<typeof DatePicker>) {
  const [date, setDate] = React.useState<Date | undefined>(args.value)
  return (
    <div className="w-64">
      <DatePicker {...args} value={date} onChange={setDate} />
    </div>
  )
}

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
}

export const Preselected: Story = {
  render: (args) => <Controlled {...args} value={new Date()} />,
}

export const Disabled: Story = {
  render: (args) => <Controlled {...args} disabled />,
}
