'use client'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  Icon,
} from '@passe/ui'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

type ThemeDropdownMenuVariant = 'icon' | 'sidebar-menu'

export function ThemeDropdownMenu({
  variant = 'icon',
  className,
}: {
  variant?: ThemeDropdownMenuVariant
  className?: string
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (variant === 'sidebar-menu') {
    return (
      <DropdownMenuRadioGroup value={resolvedTheme} onValueChange={setTheme}>
        <DropdownMenuRadioItem value="light">
          <Icon name="sun" />
          Light
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="dark">
          <Icon name="moon" />
          Dark
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            icon={mounted && resolvedTheme === 'dark' ? 'moon' : 'sun'}
            aria-label="Toggle theme"
            className={className}
          />
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
