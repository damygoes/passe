import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: 'Enter text…',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {}

export const WithIconStart: Story = {
  args: { icon: 'close', iconPosition: 'start' },
}

export const WithIconEnd: Story = {
  args: { icon: 'close', iconPosition: 'end' },
}

export const Loading: Story = {
  args: { isLoading: true },
}

export const Disabled: Story = {
  args: { disabled: true, value: 'Disabled value' },
}

export const WithValue: Story = {
  args: { value: 'Typed content', readOnly: true },
}
