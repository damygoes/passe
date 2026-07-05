import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AsyncServerComponentPreview } from '../../../../.storybook/AsyncServerComponentPreview'
import { LandingFooter } from './LandingFooter'

function LandingFooterPreview() {
  return <AsyncServerComponentPreview component={LandingFooter} props={{}} />
}

const meta: Meta<typeof LandingFooterPreview> = {
  title: 'Landing/LandingFooter',
  component: LandingFooterPreview,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof LandingFooterPreview>

export const Default: Story = {}
