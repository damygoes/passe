import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PasswordForm } from './PasswordForm'

const meta: Meta<typeof PasswordForm> = {
  title: 'Account/PasswordForm',
  component: PasswordForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof PasswordForm>

export const Default: Story = {}
