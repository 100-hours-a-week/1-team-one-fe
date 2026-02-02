import type React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from './lib/utils';

const skeletonVariants = cva('animate-pulse bg-bg-subtle', {
  variants: {
    variant: {
      rect: 'rounded-md',
      circle: 'rounded-full',
      text: 'rounded',
    },
  },
  defaultVariants: {
    variant: 'rect',
  },
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof skeletonVariants> {}

export function Skeleton({ className, variant, ...props }: SkeletonProps) {
  return <div className={cn(skeletonVariants({ variant }), className)} {...props} />;
}

Skeleton.displayName = 'Skeleton';
