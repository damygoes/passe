import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AsyncServerComponentPreview } from '../../../../.storybook/AsyncServerComponentPreview'
import { FinalCtaSection } from './FinalCtaSection'

function FinalCtaSectionPreview() {
  return <AsyncServerComponentPreview component={FinalCtaSection} props={{}} />
}

const meta: Meta<typeof FinalCtaSectionPreview> = {
  title: 'Landing/FinalCtaSection',
  component: FinalCtaSectionPreview,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FinalCtaSectionPreview>

export const Default: Story = {}
