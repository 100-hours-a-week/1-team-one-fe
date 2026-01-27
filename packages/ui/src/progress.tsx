import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';

import { cn } from './lib/utils';

const progressVariants = cva('flex w-full items-stretch gap-1', {
  variants: {
    size: {
      sm: 'h-3',
      md: 'h-6',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

type ProgressBaseProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'role'>;

export interface ProgressProps extends ProgressBaseProps, VariantProps<typeof progressVariants> {
  total: number;
  current: number;
  ariaLabel?: string;
}

const clamp = (value: number, min: number, max: number): number => {
  if (Number.isNaN(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

export function Progress({ total, current, size, className, ariaLabel, ...props }: ProgressProps) {
  const safeTotal = Math.max(0, Math.floor(total));
  const safeCurrent = safeTotal === 0 ? 0 : clamp(Math.floor(current), 1, safeTotal);

  return (
    <div
      {...props}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={safeTotal}
      aria-valuenow={safeCurrent}
      className={cn(progressVariants({ size }), 'relative', className)}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-medium text-white">
        {safeCurrent}/{safeTotal}
      </div>
      {Array.from({ length: safeTotal }).map((_, index) => {
        const isActive = index < safeCurrent;
        return (
          <div
            key={`progress-segment-${index}`}
            className={cn('flex-1 rounded-full', isActive ? 'bg-brand' : 'bg-border')}
          />
        );
      })}
    </div>
  );
}

Progress.displayName = 'Progress';
