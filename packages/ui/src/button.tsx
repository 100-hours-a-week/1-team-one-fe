import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './lib/utils';

const buttonVariants = cva(
  /* Base styles */
  [
    'inline-flex items-center justify-center gap-2',
    'rounded-lg',
    'font-medium',
    'transition-colors',
    'duration-[var(--transition-base)]',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-[var(--color-focus-ring)]',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-[var(--disabled-opacity)]',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-[var(--color-brand)]',
          'text-[var(--color-brand-contrast)]',
          'hover:bg-[var(--color-brand-hover)]',
          'active:bg-[var(--color-brand-active)]',
        ],
        secondary: [
          'bg-[var(--color-brand-secondary)]',
          'text-[var(--color-brand-secondary-contrast)]',
          'hover:bg-[var(--color-brand-secondary-hover)]',
          'active:bg-[var(--color-brand-secondary-active)]',
        ],
        outline: [
          'border',
          'border-[var(--color-border)]',
          'bg-transparent',
          'text-[var(--color-fg)]',
          'hover:bg-[var(--color-bg-subtle)]',
          'hover:border-[var(--color-border-strong)]',
        ],
        ghost: ['bg-transparent', 'text-[var(--color-fg)]', 'hover:bg-[var(--color-bg-subtle)]'],
        destructive: ['bg-error-500', 'text-white', 'hover:bg-error-600', 'active:bg-error-700'],
        point: [
          'bg-[var(--color-point)]',
          'text-[var(--color-point-contrast)]',
          'hover:bg-[var(--color-point-hover)]',
          'active:bg-[var(--color-point-active)]',
        ],
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
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp className={cn(buttonVariants({ variant, size, fullWidth, className }))} {...props} />
  );
}

export type { VariantProps as ButtonVariantProps };
