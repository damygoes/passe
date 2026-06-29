import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ResetPasswordForm } from './ResetPasswordForm'

const meta: Meta<typeof ResetPasswordForm> = {
  title: 'Auth/ResetPasswordForm',
  component: ResetPasswordForm,
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
type Story = StoryObj<typeof ResetPasswordForm>

export const Default: Story = {}
