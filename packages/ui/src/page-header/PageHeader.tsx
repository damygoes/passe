import { cn } from '@passe/utils'
import * as React from 'react'

function PageHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="page-header"
      className={cn(
        'grid auto-rows-min items-start gap-1 has-data-[slot=page-header-action]:grid-cols-[1fr_auto] has-data-[slot=page-header-description]:grid-rows-[auto_auto]',
        className,
      )}
      {...props}
    />
  )
}

function PageHeaderTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="page-header-title"
      className={cn('font-display text-2xl font-semibold leading-tight tracking-tight', className)}
      {...props}
    />
  )
}

function PageHeaderDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="page-header-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

function PageHeaderAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="page-header-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  )
}

export { PageHeader, PageHeaderAction, PageHeaderDescription, PageHeaderTitle }
