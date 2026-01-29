import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './lib/utils';
import { ElementType } from 'react';

const buttonVariants = cva(
  /* Base styles */
  [
    'inline-flex items-center justify-center gap-2',
    'rounded-lg',
    'font-medium',
    'transition-colors',
    'duration-base',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-focus-ring',
    'focus-visible:ring-offset-2',
    'focus-visible:ring-offset-bg',
    'disabled:pointer-events-none',
    'disabled:opacity-[var(--disabled-opacity)]',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-brand',
          'text-brand-contrast',
          'hover:bg-brand-hover',
          'active:bg-brand-active',
        ],

        secondary: [
          'bg-surface',
          'text-text',
          'border',
          'border-border-strong',
          'hover:bg-bg-subtle',
          'active:bg-bg-muted',
        ],

        outline: [
          'border',
          'border-border',
          'bg-transparent',
          'text-text',
          'hover:bg-bg-subtle',
          'hover:border-border-strong',
          'active:bg-bg-muted',
        ],

        ghost: ['bg-transparent', 'text-text', 'hover:bg-bg-subtle', 'active:bg-bg-muted'],

        destructive: ['bg-error-500', 'text-white', 'hover:bg-error-600', 'active:bg-error-700'],

        point: ['bg-brand-50', 'text-brand-700', 'hover:bg-brand-100', 'active:bg-brand-200'],
      },

      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },

      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },

    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  fullWidth,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = (asChild ? Slot : 'button') as ElementType;

  return (
    <Comp className={cn(buttonVariants({ variant, size, fullWidth, className }))} {...props} />
  );
}

export type { VariantProps as ButtonVariantProps };
