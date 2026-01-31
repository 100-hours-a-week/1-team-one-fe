import { Progress } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';

import { cn } from './lib/utils';

const progressVariants = cva('w-full', {
  variants: {
    variant: {
      steps: 'flex items-stretch gap-1',
      bar: 'flex flex-col gap-2',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
    },
  },
  defaultVariants: {
    variant: 'steps',
    size: 'md',
  },
});

const progressRootVariants = cva('w-full overflow-hidden rounded-full', {
  variants: {
    variant: {
      steps: 'bg-border h-3',
      bar: 'bg-border h-3',
    },
    size: {
      sm: 'h-2',
      md: 'h-5',
    },
  },
  defaultVariants: {
    variant: 'steps',
    size: 'md',
  },
});

type ProgressBaseProps = Omit<
  React.ComponentPropsWithoutRef<typeof Progress.Root>,
  'value' | 'max'
>;

export interface ProgressProps extends ProgressBaseProps, VariantProps<typeof progressVariants> {
  total: number;
  current: number;
  ariaLabel?: string;
  unitLabel?: string;
  showValue?: boolean;
}

const clamp = (value: number, min: number, max: number): number => {
  if (Number.isNaN(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

export function ProgressBar({
  total,
  current,
  size = 'md',
  variant,
  className,
  ariaLabel,
  unitLabel,
  showValue = false,
  ...props
}: ProgressProps) {
  const safeTotal = Math.max(0, Math.floor(total));
  const safeCurrent = safeTotal === 0 ? 0 : clamp(Math.floor(current), 0, safeTotal);
  const percentage = safeTotal === 0 ? 0 : (safeCurrent / safeTotal) * 100;

  return (
    <div className={cn(progressVariants({ variant, size }), className)}>
      {showValue && (
        <div className="text-text-muted flex items-center justify-between font-semibold">
          <span className="tabular-nums">
            {safeCurrent}/{safeTotal}
            {unitLabel ? ` ${unitLabel}` : ''}
          </span>
        </div>
      )}
      <Progress.Root
        {...props}
        value={safeCurrent}
        max={safeTotal}
        aria-label={ariaLabel}
        className={cn(progressRootVariants({ variant, size }))}
      >
        {variant === 'steps' ? (
          <>
            {Array.from({ length: safeTotal }).map((_, index) => {
              const isActive = index < safeCurrent;
              return (
                <div
                  key={`progress-segment-${index}`}
                  className={cn('flex-1 rounded-full', isActive ? 'bg-brand' : 'bg-border')}
                />
              );
            })}
          </>
        ) : (
          <Progress.Indicator
            className="bg-brand duration-base h-full rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        )}
      </Progress.Root>
    </div>
  );
}

ProgressBar.displayName = 'ProgressBar';
