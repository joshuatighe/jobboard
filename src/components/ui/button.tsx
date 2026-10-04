import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/lib/utils'

/**
 * Focus never changes a button's footprint, so it lines up with its neighbours: ghost and secondary
 * buttons get a 1px inset ink hairline, outline buttons turn their border ink, and solid buttons
 * get a 1px paper hairline drawn inside the fill.
 *
 * Buttons are ink on paper. There is no accent-coloured button: `brand` is kept as an alias of
 * `default` so call sites that mean "the primary call to action" keep working.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-[background-color,color,border-color,box-shadow,opacity] duration-150 outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/85 focus-visible:outline-1 focus-visible:-outline-offset-4 focus-visible:outline-solid focus-visible:outline-primary-foreground',
        brand: 'bg-primary text-primary-foreground hover:bg-primary/85 focus-visible:outline-1 focus-visible:-outline-offset-4 focus-visible:outline-solid focus-visible:outline-primary-foreground',
        destructive:
          'bg-destructive text-primary-foreground hover:bg-destructive/90 focus-visible:outline-1 focus-visible:-outline-offset-4 focus-visible:outline-solid focus-visible:outline-primary-foreground',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground focus-visible:border-ring',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/70 focus-visible:ring-1 focus-visible:ring-inset',
        ghost: 'hover:bg-accent hover:text-accent-foreground focus-visible:ring-1 focus-visible:ring-inset',
        link: 'h-auto px-0 underline decoration-border underline-offset-4 hover:decoration-foreground focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      },
      size: {
        default: 'h-9 px-4 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 px-3 text-[13px] has-[>svg]:px-2.5',
        lg: 'h-11 px-5 text-[15px] has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

// eslint-disable-next-line react/only-export-components
export { Button, buttonVariants }
