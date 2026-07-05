import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AccountViewError } from './AccountViewError'

const meta: Meta<typeof AccountViewError> = {
  title: 'Account/AccountViewError',
  component: AccountViewError,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AccountViewError>

export const Default: Story = {}
