import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { WhatYouKeepSection } from './WhatYouKeepSection'

const meta: Meta<typeof WhatYouKeepSection> = {
  title: 'Landing/WhatYouKeepSection',
  component: WhatYouKeepSection,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof WhatYouKeepSection>

export const Default: Story = {}
