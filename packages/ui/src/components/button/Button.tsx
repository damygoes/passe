import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md font-body text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-terracotta text-aged-cream hover:bg-terracotta-dark',
        outline:
          'border border-terracotta bg-transparent text-terracotta hover:bg-terracotta hover:text-aged-cream',
        ghost: 'text-dark-espresso hover:bg-sandy-beige hover:text-dark-espresso',
        secondary: 'bg-sandy-beige text-dark-espresso hover:bg-sandy-beige-dark',
        destructive: 'bg-red-500 text-aged-cream hover:bg-red-600',
        link: 'text-terracotta underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
