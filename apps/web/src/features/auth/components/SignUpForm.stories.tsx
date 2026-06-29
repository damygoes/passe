import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SignUpForm } from './SignUpForm'

const meta: Meta<typeof SignUpForm> = {
  title: 'Auth/SignUpForm',
  component: SignUpForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-80 mx-auto">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof SignUpForm>

export const Default: Story = {}
