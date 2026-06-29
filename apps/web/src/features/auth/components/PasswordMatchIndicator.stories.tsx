import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PasswordMatchIndicator } from './PasswordMatchIndicator'

const meta: Meta<typeof PasswordMatchIndicator> = {
  title: 'Auth/PasswordMatchIndicator',
  component: PasswordMatchIndicator,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PasswordMatchIndicator>

export const Matching: Story = {
  args: {
    password: 'MySecret123!',
    confirmPassword: 'MySecret123!',
  },
}

export const NotMatching: Story = {
  args: {
    password: 'MySecret123!',
    confirmPassword: 'different',
  },
}
