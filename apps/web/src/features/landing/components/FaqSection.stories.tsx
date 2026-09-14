import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AsyncServerComponentPreview } from '../../../../.storybook/AsyncServerComponentPreview'
import { FaqSection } from './FaqSection'

function FaqSectionPreview() {
  return <AsyncServerComponentPreview component={FaqSection} props={{}} />
}

const meta: Meta<typeof FaqSectionPreview> = {
  title: 'Landing/FaqSection',
  component: FaqSectionPreview,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FaqSectionPreview>

export const Default: Story = {}
