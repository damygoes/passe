'use client'

import { Badge } from '@passe/ui/badge'
import { Icon } from '@passe/ui/icon'
import { Input } from '@passe/ui/input'
import { useState, type KeyboardEvent } from 'react'

interface CountryTagsInputProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  removeLabel?: string
  id?: string
  'aria-invalid'?: boolean
}

export function CountryTagsInput({
  value,
  onChange,
  placeholder,
  removeLabel = 'Remove',
  id,
  'aria-invalid': ariaInvalid,
}: CountryTagsInputProps) {
  const [draft, setDraft] = useState('')

  const addCountry = (raw: string) => {
    const country = raw.trim()
    if (!country) return
    const exists = value.some((c) => c.toLowerCase() === country.toLowerCase())
    if (!exists) onChange([...value, country])
    setDraft('')
  }

  const removeCountry = (country: string) => {
    onChange(value.filter((c) => c !== country))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addCountry(draft)
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      removeCountry(value[value.length - 1]!)
    }
  }

  return (
    <div className="space-y-2">
      <Input
        id={id}
        type="text"
        value={draft}
        placeholder={placeholder}
        icon="globe"
        iconPosition="start"
        aria-invalid={ariaInvalid}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addCountry(draft)}
      />
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {value.map((country) => (
            <li key={country}>
              <Badge variant="secondary" className="gap-1 pr-1">
                {country}
                <button
                  type="button"
                  onClick={() => removeCountry(country)}
                  aria-label={`${removeLabel} ${country}`}
                  className="rounded-full p-0.5 hover:bg-foreground/10"
                >
                  <Icon name="close" size="xs" aria-hidden="true" />
                </button>
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
