import type React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Skeleton } from './skeleton';
import { cn } from './lib/utils';

const skeletonAvatarVariants = cva('', {
  variants: {
    size: {
      sm: 'h-8 w-8',
      md: 'h-12 w-12',
      lg: 'h-16 w-16',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface SkeletonAvatarProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof skeletonAvatarVariants> {}

export function SkeletonAvatar({ className, size, ...props }: SkeletonAvatarProps) {
  return (
    <Skeleton
      variant="circle"
      className={cn(skeletonAvatarVariants({ size }), className)}
      {...props}
    />
  );
}

SkeletonAvatar.displayName = 'SkeletonAvatar';
