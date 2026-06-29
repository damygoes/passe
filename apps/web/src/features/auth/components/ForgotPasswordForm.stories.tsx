import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ForgotPasswordForm } from './ForgotPasswordForm'

const meta: Meta<typeof ForgotPasswordForm> = {
  title: 'Auth/ForgotPasswordForm',
  component: ForgotPasswordForm,
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
type Story = StoryObj<typeof ForgotPasswordForm>

export const Default: Story = {}
