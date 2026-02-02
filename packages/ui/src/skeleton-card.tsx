import type React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Skeleton } from './skeleton';
import { cn } from './lib/utils';

const skeletonCardVariants = cva('rounded-lg', {
  variants: {
    padding: {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    },
  },
  defaultVariants: {
    padding: 'md',
  },
});

export interface SkeletonCardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof skeletonCardVariants> {
  height?: string;
}

export function SkeletonCard({ className, padding, height, style, ...props }: SkeletonCardProps) {
  return (
    <Skeleton
      variant="rect"
      className={cn(skeletonCardVariants({ padding }), className)}
      style={{ height, ...style }}
      {...props}
    />
  );
}

SkeletonCard.displayName = 'SkeletonCard';
