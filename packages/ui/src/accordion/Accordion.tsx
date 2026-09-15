'use client'

import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion'
import { cn } from '@passe/utils'
import * as React from 'react'
import { Icon } from '../icon/Icon'

function Accordion<Value = string>({ ...props }: AccordionPrimitive.Root.Props<Value>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('rounded-[26px] bg-popover p-[20px_24px] shadow-soft-sm', className)}
      {...props}
    />
  )
}

function AccordionHeader({ className, ...props }: AccordionPrimitive.Header.Props) {
  return (
    <AccordionPrimitive.Header
      data-slot="accordion-header"
      className={cn('flex', className)}
      {...props}
    />
  )
}

function AccordionTrigger({ className, children, ...props }: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Trigger
      data-slot="accordion-trigger"
      className={cn(
        'group/accordion-trigger flex w-full items-center justify-between gap-4 text-left font-display text-lg outline-none focus-visible:text-primary md:text-xl',
        className,
      )}
      {...props}
    >
      <span className="min-w-0">{children}</span>
      <span className="relative flex size-5 shrink-0 items-center justify-center text-primary">
        <Icon
          name="plus"
          size="sm"
          aria-hidden
          className="absolute transition-opacity group-data-[panel-open]/accordion-trigger:opacity-0"
        />
        <Icon
          name="minus"
          size="sm"
          aria-hidden
          className="absolute opacity-0 transition-opacity group-data-[panel-open]/accordion-trigger:opacity-100"
        />
      </span>
    </AccordionPrimitive.Trigger>
  )
}

function AccordionPanel({ className, children, ...props }: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-panel"
      className={cn(
        'h-(--accordion-panel-height) overflow-hidden text-[15px] leading-relaxed text-muted-foreground transition-[height] duration-200 ease-out data-[ending-style]:h-0 data-[starting-style]:h-0',
        className,
      )}
      {...props}
    >
      <div className="max-w-[620px] pt-3">{children}</div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger }
