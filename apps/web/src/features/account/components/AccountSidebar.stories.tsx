import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { AccountSidebar, type AccountTab } from './AccountSidebar'

const meta: Meta<typeof AccountSidebar> = {
  title: 'Account/AccountSidebar',
  component: AccountSidebar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AccountSidebar>

function Controlled({ initialTab }: { initialTab: AccountTab }) {
  const [tab, setTab] = useState<AccountTab>(initialTab)
  return <AccountSidebar activeTab={tab} onTabChange={setTab} />
}

export const Profile: Story = {
  render: () => <Controlled initialTab="profile" />,
}

export const Security: Story = {
  render: () => <Controlled initialTab="security" />,
}

export const Danger: Story = {
  render: () => <Controlled initialTab="danger" />,
}
