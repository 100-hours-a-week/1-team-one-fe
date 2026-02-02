import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './lib/utils';

const chipVariants = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-full',
    'px-4 py-2',
    'text-sm font-medium',
    'transition-all',
    'duration-base',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-focus-ring',
    'focus-visible:ring-offset-2',
  ],
  {
    variants: {
      variant: {
        default: ['bg-bg-subtle', 'text-text', 'border', 'border-border'],
        selectable: [
          'border',
          'cursor-pointer',
          'hover:bg-brand-300',
          'hover:border-brand-300',
          'hover:text-brand-contrast',
          'active:scale-95',
        ],
        text: [''],
        date: ['border', 'border-brand-400'],
      },
      selected: {
        true: ['bg-brand', 'text-brand-contrast', 'border-brand'],
        false: ['bg-surface', 'text-text', 'border-border'],
      },
      size: {
        sm: 'h-7 px-3 text-xs',
        md: 'h-8 px-4 text-sm',
      },
      disabled: {
        true: ['pointer-events-none', 'opacity-[var(--disabled-opacity)]'],
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'selectable',
        selected: false,
        className: 'hover:border-border-strong',
      },
    ],
    defaultVariants: {
      variant: 'default',
      selected: false,
      size: 'md',
      disabled: false,
    },
  },
);

export interface ChipProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'disabled'>,
    VariantProps<typeof chipVariants> {
  label: string;
  selected?: boolean;
  disabled?: boolean;
}

export function Chip({
  className,
  variant,
  selected,
  size,
  disabled,
  label,
  onClick,
  ...props
}: ChipProps) {
  const isButton = variant === 'selectable';

  if (!isButton) {
    return (
      <span className={cn(chipVariants({ variant, selected, size, disabled, className }))}>
        {label}
      </span>
    );
  }

  return (
    <button
      type="button"
      className={cn(chipVariants({ variant, selected, size, disabled, className }))}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {label}
    </button>
  );
}
