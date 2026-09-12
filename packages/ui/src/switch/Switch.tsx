'use client'

import { Switch as SwitchPrimitive } from '@base-ui/react/switch'
import { cn } from '@passe/utils'

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // The "on" state is deep-olive (not the terracotta primary) — matches
        // the redesign's private-badge/map-pin/toggle-on accent throughout.
        'peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent shadow-xs outline-none transition-all duration-150 ease-out focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-45 data-[checked]:bg-deep-olive data-[unchecked]:bg-input',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block size-4 rounded-full bg-warm-white ring-0 transition-transform duration-150 ease-out data-[checked]:translate-x-4 data-[unchecked]:translate-x-0.5',
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
