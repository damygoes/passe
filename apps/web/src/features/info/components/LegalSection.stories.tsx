import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LegalSection } from './LegalSection'

const meta: Meta<typeof LegalSection> = {
  title: 'Info/LegalSection',
  component: LegalSection,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof LegalSection>

export const ParagraphsOnly: Story = {
  args: {
    heading: '1. Data Controller',
    paragraphs: [
      'This privacy policy explains how personal data is processed when you use the Service.',
      'The controller within the meaning of the GDPR is: [FULL NAME], Germany.',
    ],
  },
}

export const WithList: Story = {
  args: {
    heading: '3. Data We Collect',
    paragraphs: ['We process the following categories of personal data:'],
    listItems: [
      'Account data — your name, email address, and password.',
      'Content data — the trips and memories you create.',
      'Technical data — IP address and server logs.',
    ],
    outro: ['You also have the right to lodge a complaint with a supervisory authority.'],
  },
}
