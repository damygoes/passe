'use client'

import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from '@passe/ui/accordion'

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <Accordion defaultValue={[items[0]?.id ?? '']} className="flex flex-col gap-3">
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionHeader>
            <AccordionTrigger>{item.question}</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>{item.answer}</AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
