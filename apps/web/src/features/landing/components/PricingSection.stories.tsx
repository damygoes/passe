import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AsyncServerComponentPreview } from '../../../../.storybook/AsyncServerComponentPreview'
import { PricingSection } from './PricingSection'

function PricingSectionPreview() {
  return <AsyncServerComponentPreview component={PricingSection} props={{}} />
}

const meta: Meta<typeof PricingSectionPreview> = {
  title: 'Landing/PricingSection',
  component: PricingSectionPreview,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PricingSectionPreview>

export const Default: Story = {}
