import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AsyncServerComponentPreview } from '../../../../.storybook/AsyncServerComponentPreview'
import { PrivacySection } from './PrivacySection'

function PrivacySectionPreview() {
  return <AsyncServerComponentPreview component={PrivacySection} props={{}} />
}

const meta: Meta<typeof PrivacySectionPreview> = {
  title: 'Landing/PrivacySection',
  component: PrivacySectionPreview,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PrivacySectionPreview>

export const Default: Story = {}
