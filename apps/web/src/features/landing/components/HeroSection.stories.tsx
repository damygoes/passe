import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AsyncServerComponentPreview } from '../../../../.storybook/AsyncServerComponentPreview'
import { HeroSection } from './HeroSection'

function HeroSectionPreview() {
  return <AsyncServerComponentPreview component={HeroSection} props={{}} />
}

const meta: Meta<typeof HeroSectionPreview> = {
  title: 'Landing/HeroSection',
  component: HeroSectionPreview,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof HeroSectionPreview>

export const Default: Story = {}
