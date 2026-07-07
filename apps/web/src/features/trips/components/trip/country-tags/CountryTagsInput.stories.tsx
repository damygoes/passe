import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { CountryTagsInput } from './CountryTagsInput'

const meta: Meta<typeof CountryTagsInput> = {
  title: 'Trips/CountryTagsInput',
  component: CountryTagsInput,
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
type Story = StoryObj<typeof CountryTagsInput>

function Controlled({ initial }: { initial: string[] }) {
  const [countries, setCountries] = useState<string[]>(initial)
  return (
    <CountryTagsInput
      value={countries}
      onChange={setCountries}
      placeholder="Add a country and press Enter"
      removeLabel="Remove"
    />
  )
}

export const Empty: Story = {
  render: () => <Controlled initial={[]} />,
}

export const WithCountries: Story = {
  render: () => <Controlled initial={['Morocco', 'Spain', 'Portugal']} />,
}
