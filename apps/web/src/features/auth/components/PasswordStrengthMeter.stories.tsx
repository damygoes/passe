import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'

const meta: Meta<typeof PasswordStrengthMeter> = {
  title: 'Auth/PasswordStrengthMeter',
  component: PasswordStrengthMeter,
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
type Story = StoryObj<typeof PasswordStrengthMeter>

export const Weak: Story = {
  args: { password: 'abc' },
}

export const Fair: Story = {
  args: { password: 'abc123' },
}

export const Good: Story = {
  args: { password: 'Abc123!' },
}

export const Strong: Story = {
  args: { password: 'Abc123!@' },
}

export const VeryStrong: Story = {
  args: { password: 'Abc123!@#Xyz9' },
}
