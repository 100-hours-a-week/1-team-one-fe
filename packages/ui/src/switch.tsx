import { Switch as SwitchPrimitive } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './lib/utils';

const switchRootVariants = cva(
  [
    'relative inline-flex shrink-0 items-center',
    'rounded-full',
    'border',
    'transition-colors',
    'duration-base',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-focus-ring',
    'focus-visible:ring-offset-2',
    'focus-visible:ring-offset-bg',
    'disabled:cursor-not-allowed',
    'disabled:opacity-[var(--disabled-opacity)]',
    'data-[state=unchecked]:bg-bg-muted',
    'data-[state=unchecked]:border-border',
    'data-[state=checked]:bg-brand',
    'data-[state=checked]:border-brand',
  ],
  {
    variants: {
      size: {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const switchThumbVariants = cva(
  [
    'pointer-events-none',
    'inline-block',
    'rounded-full',
    'bg-surface',
    'shadow-sm',
    'transition-transform',
    'duration-base',
    'data-[state=unchecked]:translate-x-0',
  ],
  {
    variants: {
      size: {
        sm: 'h-4 w-4 data-[state=checked]:translate-x-4',
        md: 'h-5 w-5 data-[state=checked]:translate-x-5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface SwitchProps
  extends
    React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchRootVariants> {}

export function Switch({ className, size, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root className={cn(switchRootVariants({ size, className }))} {...props}>
      <SwitchPrimitive.Thumb className={cn(switchThumbVariants({ size }))} />
    </SwitchPrimitive.Root>
  );
}
