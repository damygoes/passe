import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AsyncServerComponentPreview } from '../../../../.storybook/AsyncServerComponentPreview'
import { HowItWorksSection } from './HowItWorksSection'

function HowItWorksSectionPreview() {
  return <AsyncServerComponentPreview component={HowItWorksSection} props={{}} />
}

const meta: Meta<typeof HowItWorksSectionPreview> = {
  title: 'Landing/HowItWorksSection',
  component: HowItWorksSectionPreview,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof HowItWorksSectionPreview>

export const Default: Story = {}
