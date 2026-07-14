import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button/Button'
import { Icon } from '../icon/Icon'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip'

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="flex min-h-32 items-center justify-center">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
      <TooltipContent>Save this trip</TooltipContent>
    </Tooltip>
  ),
}

export const Sides: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Top</Button>} />
        <TooltipContent side="top">Top tooltip</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Right</Button>} />
        <TooltipContent side="right">Right tooltip</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Bottom</Button>} />
        <TooltipContent side="bottom">Bottom tooltip</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Left</Button>} />
        <TooltipContent side="left">Left tooltip</TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const IconTrigger: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button variant="ghost" size="icon-sm">
            <Icon name="panel-left" />
          </Button>
        }
      />
      <TooltipContent>Toggle sidebar</TooltipContent>
    </Tooltip>
  ),
}

export const LongContent: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline">Trip status</Button>} />
      <TooltipContent>
        This trip is private — only you can see its memories until you make it public.
      </TooltipContent>
    </Tooltip>
  ),
}
