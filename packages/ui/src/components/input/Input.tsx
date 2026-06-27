import * as React from 'react'

import { cn } from '../../utils/cn'
import { Icon } from '../icon/Icon'
import type { IconName, IconPosition, IconSize } from '../icon/types'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: IconName
  iconPosition?: IconPosition
  iconSize?: IconSize
  iconProps?: Omit<React.ComponentProps<typeof Icon>, 'name' | 'size' | 'aria-hidden'>
  isLoading?: boolean
  onIconClick?: () => void
}

const iconSizeMap: Record<NonNullable<InputProps['iconPosition']>, IconSize> = {
  start: 'md',
  end: 'md',
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    icon,
    iconPosition = 'start',
    iconSize,
    iconProps,
    isLoading = false,
    onIconClick,
    disabled,
    ...props
  },
  ref,
) {
  const hasIcon = Boolean(icon || isLoading)

  const effectiveIconSize = iconSize ?? iconSizeMap[iconPosition]

  const iconName: IconName | undefined = isLoading ? 'loading' : icon

  const mergedIconProps = {
    strokeWidth: 1.8,
    color: 'currentColor',
    ...iconProps,
  }

  const renderIcon = () => {
    if (!iconName) {
      return null
    }

    const iconClassName = cn(
      'absolute top-1/2 -translate-y-1/2 text-foreground/60',
      iconPosition === 'start' ? 'left-3' : 'right-3',
      iconName === 'loading' && 'animate-spin',
    )

    const icon = (
      <Icon name={iconName} size={effectiveIconSize} aria-hidden="true" {...mergedIconProps} />
    )

    if (onIconClick && !isLoading && !disabled) {
      return (
        <button
          type="button"
          aria-label="input action"
          className={cn(iconClassName, 'cursor-pointer')}
          onClick={onIconClick}
          tabIndex={-1}
        >
          {icon}
        </button>
      )
    }

    return <span className={cn(iconClassName, 'pointer-events-none')}>{icon}</span>
  }

  return (
    <div data-slot="input-wrapper" className="relative w-full">
      {renderIcon()}

      <input
        ref={ref}
        data-slot="input"
        disabled={disabled}
        className={cn(
          [
            'bg-input/20 dark:bg-input/30',
            'border-input',
            'focus-visible:border-ring',
            'focus-visible:ring-ring/30',
            'aria-invalid:border-destructive',
            'aria-invalid:ring-destructive/20',
            'dark:aria-invalid:border-destructive',
            'h-12 w-full min-w-0 rounded-xl border',
            'px-4 py-1 text-sm',
            'transition-colors outline-none',
            'placeholder:text-muted-foreground',
            'disabled:pointer-events-none',
            'disabled:cursor-not-allowed',
            'disabled:opacity-50',
          ].join(' '),
          hasIcon && iconPosition === 'start' && 'pl-10',
          hasIcon && iconPosition === 'end' && 'pr-10',
          className,
        )}
        {...props}
      />
    </div>
  )
})

Input.displayName = 'Input'
