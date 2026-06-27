import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'

import { cn } from '@passe/utils'
import { Icon } from '../icon/Icon'
import type { IconName, IconPosition, IconSize } from '../icon/types'

const buttonVariants = cva(
  [
    'group/button inline-flex shrink-0 items-center justify-center rounded-full',
    'border border-transparent bg-clip-padding',
    'font-body text-sm font-medium whitespace-nowrap',
    'transition-all outline-none select-none',
    'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
    'active:not-aria-[haspopup]:translate-y-px',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-terracotta text-aged-cream hover:bg-terracotta-dark',
        outline:
          'border-terracotta bg-transparent text-terracotta hover:bg-terracotta hover:text-aged-cream',
        secondary: 'bg-sandy-beige text-dark-espresso hover:bg-sandy-beige-dark',
        ghost: 'text-dark-espresso hover:bg-sandy-beige',
        destructive: 'bg-red-500 text-aged-cream hover:bg-red-600',
        link: 'text-terracotta underline-offset-4 hover:underline',
      },

      size: {
        default:
          "h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4",
        xs: "h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-12 gap-1.5 px-3 text-base',
        icon: 'size-8',
        'icon-xs': 'size-6',
        'icon-sm': 'size-7',
        'icon-lg': 'size-9',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonIconProps = Omit<React.ComponentProps<typeof Icon>, 'name' | 'size' | 'aria-hidden'>

export interface ButtonProps extends ButtonPrimitive.Props, VariantProps<typeof buttonVariants> {
  icon?: IconName
  iconPosition?: IconPosition
  iconSize?: IconSize
  iconProps?: ButtonIconProps
  isLoading?: boolean
}

const iconSizeMap: Record<NonNullable<ButtonProps['size']>, IconSize> = {
  xs: 'xs',
  sm: 'xs',
  default: 'sm',
  lg: 'sm',
  icon: 'sm',
  'icon-xs': 'xs',
  'icon-sm': 'sm',
  'icon-lg': 'sm',
}

function Button({
  className,
  variant = 'default',
  size = 'default',

  icon,
  iconSize,
  iconPosition = 'start',
  iconProps,

  isLoading = false,

  disabled,
  children,

  ...props
}: ButtonProps) {
  const resolvedSize = (size ?? 'default') as NonNullable<ButtonProps['size']>

  const effectiveIconSize = iconSize ?? iconSizeMap[resolvedSize]

  const isIconOnly = resolvedSize.startsWith('icon')

  const showIcon = isLoading || !!icon

  const iconName: IconName | null = showIcon ? (isLoading ? 'loading' : (icon ?? null)) : null

  const renderIcon = (position: IconPosition) => {
    if (!iconName) {
      return null
    }

    return (
      <span data-icon={position} className={cn(isLoading && 'animate-spin')}>
        <Icon name={iconName} size={effectiveIconSize} aria-hidden="true" {...iconProps} />
      </span>
    )
  }

  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={resolvedSize}
      className={cn(
        buttonVariants({
          variant,
          size: resolvedSize,
          className,
        }),
      )}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isIconOnly ? (
        renderIcon('start')
      ) : (
        <>
          {iconPosition === 'start' && renderIcon('start')}

          {children}

          {iconPosition === 'end' && !isLoading && renderIcon('end')}
        </>
      )}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
