'use client'

import { cn } from '@passe/utils'
import { format } from 'date-fns'
import * as React from 'react'
import { Button } from '../button/Button'
import { Calendar } from '../calendar/Calendar'
import { Icon } from '../icon/Icon'
import { Popover, PopoverContent, PopoverTrigger } from '../popover/Popover'

export interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  id?: string
  className?: string
  /** Restrict selectable days (passed through to the calendar). */
  fromDate?: Date
  toDate?: Date
  'aria-invalid'?: boolean
}

function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled,
  id,
  className,
  fromDate,
  toDate,
  'aria-invalid': ariaInvalid,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={ariaInvalid}
            data-slot="date-picker-trigger"
            className={cn(
              'w-full justify-between px-3 font-normal',
              !value && 'text-muted-foreground',
              className,
            )}
          >
            {value ? format(value, 'PPP') : placeholder}
            <Icon name="calendar" size="sm" className="text-muted-foreground" aria-hidden="true" />
          </Button>
        }
      />
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange?.(date)
            setOpen(false)
          }}
          autoFocus
          disabled={
            fromDate || toDate
              ? [...(fromDate ? [{ before: fromDate }] : []), ...(toDate ? [{ after: toDate }] : [])]
              : undefined
          }
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
