import type React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from './lib/utils';

const streakBadgeVariants = cva(
  ['relative inline-flex items-center justify-center', 'rounded-full'],
  {
    variants: {
      size: {
        sm: 'h-5 w-5 text-[10px]',
        md: 'h-6 w-6 text-xs',
        lg: 'h-8 w-8 text-sm',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface StreakBadgeProps
  extends React.ComponentPropsWithoutRef<'span'>, VariantProps<typeof streakBadgeVariants> {
  streak: number;
  icon?: React.ReactNode;
}

const getSafeStreak = (streak: number) => {
  if (Number.isNaN(streak)) return 0;
  return Math.max(0, Math.floor(streak));
};

export function StreakBadge({ streak, icon, size, className, ...props }: StreakBadgeProps) {
  const safeStreak = getSafeStreak(streak);
  const resolvedIcon = icon ?? <span className="text-base" aria-hidden="true"></span>;

  return (
    <span className={cn(streakBadgeVariants({ size }), className)} {...props}>
      <span className="flex h-full w-full items-center justify-center" aria-hidden="true">
        {resolvedIcon}
      </span>
      <span className="text-text absolute inset-0 flex items-center justify-center font-semibold tabular-nums">
        {safeStreak}
      </span>
    </span>
  );
}

StreakBadge.displayName = 'StreakBadge';
