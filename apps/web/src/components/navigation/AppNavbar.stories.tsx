import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AsyncServerComponentPreview } from '../../../.storybook/AsyncServerComponentPreview'
import { AppNavbar } from './AppNavbar'

interface AppNavbarPreviewProps {
  displayName: string
  email: string
  avatarUrl: string | null
  username: string | null
}

function AppNavbarPreview(props: AppNavbarPreviewProps) {
  return <AsyncServerComponentPreview component={AppNavbar} props={props} />
}

const meta: Meta<typeof AppNavbarPreview> = {
  title: 'Shared/AppNavbar',
  component: AppNavbarPreview,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AppNavbarPreview>

export const Default: Story = {
  args: {
    displayName: 'Amara Okafor',
    email: 'amara@example.com',
    avatarUrl: null,
    username: 'amara',
  },
}

export const NoPublicPortfolio: Story = {
  args: {
    displayName: 'Kenji Watanabe',
    email: 'kenji@example.com',
    avatarUrl: null,
    username: null,
  },
}
