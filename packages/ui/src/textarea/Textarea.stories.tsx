import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from './Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: { placeholder: 'Write a note about this memory…' },
}

export const WithValue: Story = {
  args: {
    value: 'We wandered through the narrow streets of Lisbon as the sun set over the river.',
    readOnly: true,
  },
}

export const Disabled: Story = {
  args: { placeholder: 'Disabled textarea', disabled: true },
}
