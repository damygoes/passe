import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AsyncServerComponentPreview } from '../../../../.storybook/AsyncServerComponentPreview'
import { FeaturesSection } from './FeaturesSection'

function FeaturesSectionPreview() {
  return <AsyncServerComponentPreview component={FeaturesSection} props={{}} />
}

const meta: Meta<typeof FeaturesSectionPreview> = {
  title: 'Landing/FeaturesSection',
  component: FeaturesSectionPreview,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FeaturesSectionPreview>

export const Default: Story = {}
