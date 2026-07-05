import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button/Button'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './Popover'

const meta = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Trip stats</Button>} />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Morocco, 2024</PopoverTitle>
          <PopoverDescription>12 memories across 4 cities.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
}

export const Aligned: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="ghost">Filters</Button>} />
      <PopoverContent align="start">
        <PopoverHeader>
          <PopoverTitle>Filter memories</PopoverTitle>
          <PopoverDescription>Choose a country or date range to narrow results.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
}
