import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from './Accordion'

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof Accordion>

const FAQ_ITEMS = [
  {
    value: 'public',
    question: 'Is anything public unless I say so?',
    answer:
      'No. Trips, memories and your map are closed by default. Sharing is per-trip, by publishing your portfolio, and you can make anything private again at any time.',
  },
  {
    value: 'offline',
    question: 'Does it work offline, on the road?',
    answer:
      "Not yet — writing and photo uploads need a connection today. Offline support is something we're working on.",
  },
  {
    value: 'android',
    question: 'Is there an Android app?',
    answer: 'Passe is on the App Store today, and the Android app is coming soon to Google Play.',
  },
] as const

export const Default: Story = {
  render: () => (
    <div className="w-[420px] max-w-full space-y-3 bg-background p-6">
      <Accordion defaultValue={['public']}>
        {FAQ_ITEMS.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionHeader>
              <AccordionTrigger>{item.question}</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>{item.answer}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
}
