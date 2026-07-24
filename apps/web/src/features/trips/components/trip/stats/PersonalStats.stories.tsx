import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PersonalStats } from './PersonalStats'

const meta: Meta<typeof PersonalStats> = {
  title: 'Trips/PersonalStats',
  component: PersonalStats,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PersonalStats>

export const Default: Story = {
  args: {
    countriesCount: 12,
    citiesCount: 47,
    yearsCount: 3,
  },
}

export const SingleOfEach: Story = {
  args: {
    countriesCount: 1,
    citiesCount: 1,
    yearsCount: 1,
  },
}

export const Empty: Story = {
  args: {
    countriesCount: 0,
    citiesCount: 0,
    yearsCount: 0,
  },
}

export const Scrapbook: Story = {
  args: Default.args,
  decorators: [
    (Story) => (
      <div data-theme="scrapbook" className="bg-background p-6">
        <Story />
      </div>
    ),
  ],
}
