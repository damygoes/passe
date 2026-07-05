import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AsyncServerComponentPreview } from '../../../../.storybook/AsyncServerComponentPreview'
import { LandingHeader } from './LandingHeader'

function LandingHeaderPreview() {
  return <AsyncServerComponentPreview component={LandingHeader} props={{}} />
}

const meta: Meta<typeof LandingHeaderPreview> = {
  title: 'Landing/LandingHeader',
  component: LandingHeaderPreview,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof LandingHeaderPreview>

export const Default: Story = {}
