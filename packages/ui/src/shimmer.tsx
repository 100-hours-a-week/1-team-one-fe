import type React from 'react';
import { cn } from './lib/utils';

export interface ShimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Shimmer({ className, children, ...props }: ShimmerProps) {
  return (
    <div className={cn('relative overflow-hidden', className)} {...props}>
      {children}
      <div className="animate-shimmer absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

Shimmer.displayName = 'Shimmer';
