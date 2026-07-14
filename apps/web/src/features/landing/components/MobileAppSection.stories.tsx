import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AsyncServerComponentPreview } from '../../../../.storybook/AsyncServerComponentPreview'
import { MobileAppSection } from './MobileAppSection'

function MobileAppSectionPreview() {
  return <AsyncServerComponentPreview component={MobileAppSection} props={{}} />
}

const meta: Meta<typeof MobileAppSectionPreview> = {
  title: 'Landing/MobileAppSection',
  component: MobileAppSectionPreview,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MobileAppSectionPreview>

export const Default: Story = {}
