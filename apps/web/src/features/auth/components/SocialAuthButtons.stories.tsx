import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SocialAuthButtons } from './SocialAuthButtons'

const meta: Meta<typeof SocialAuthButtons> = {
  title: 'Auth/SocialAuthButtons',
  component: SocialAuthButtons,
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
type Story = StoryObj<typeof SocialAuthButtons>

export const SignInMode: Story = {
  args: { mode: 'sign-in' },
}

export const SignUpMode: Story = {
  args: { mode: 'sign-up' },
}
