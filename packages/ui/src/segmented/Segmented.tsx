'use client'

import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import { cn } from '@passe/utils'
import * as React from 'react'

function Segmented({ className, ...props }: RadioGroup.Props) {
  return (
    <RadioGroup
      data-slot="segmented"
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full border border-border bg-background p-1',
        className,
      )}
      {...props}
    />
  )
}

function SegmentedItem({
  className,
  children,
  ...props
}: Radio.Root.Props & { children: React.ReactNode }) {
  return (
    <Radio.Root
      data-slot="segmented-item"
      className={cn(
        'cursor-pointer rounded-full px-4 py-1.5 text-sm text-foreground outline-none transition-colors duration-150 ease-out select-none data-[checked]:bg-terracotta data-[checked]:text-primary-foreground data-[unchecked]:hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    >
      {children}
    </Radio.Root>
  )
}

export { Segmented, SegmentedItem }
