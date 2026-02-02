import type React from 'react';
import { Skeleton } from './skeleton';
import { cn } from './lib/utils';

const DEFAULT_WIDTHS = ['100%', '100%', '60%'];

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number; //표시 줄 수
  widths?: string[]; //각줄 너비
}

export function SkeletonText({
  className,
  lines = 3,
  widths = DEFAULT_WIDTHS,
  ...props
}: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, index) => {
        const width = widths[index % widths.length];
        return <Skeleton key={index} variant="text" className="h-4" style={{ width }} />;
      })}
    </div>
  );
}

SkeletonText.displayName = 'SkeletonText';
