import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { NextIntlClientProvider } from 'next-intl'
import deMessages from '../../../../../packages/i18n/src/locales/de.json'
import { LocaleDropdownMenu } from './LocaleDropdownMenu'

const meta: Meta<typeof LocaleDropdownMenu> = {
  title: 'Shared/LocaleDropdownMenu',
  component: LocaleDropdownMenu,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex min-h-24 items-start justify-center pt-4">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof LocaleDropdownMenu>

export const English: Story = {}

export const German: Story = {
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="de" messages={deMessages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
}
