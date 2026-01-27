import type { ReactNode } from 'react';

import { cn } from './lib/utils';

export interface CarouselProps {
  activeIndex: number;
  children: ReactNode;
  className?: string;
  trackClassName?: string;
}

export function Carousel({ activeIndex, children, className, trackClassName }: CarouselProps) {
  return (
    <div className={cn('overflow-hidden', className)}>
      <div
        className={cn('duration-base flex transition-transform ease-out', trackClassName)}
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {children}
      </div>
    </div>
  );
}

export interface CarouselItemProps {
  children: ReactNode;
  className?: string;
}

export function CarouselItem({ children, className }: CarouselItemProps) {
  return <div className={cn('w-full shrink-0', className)}>{children}</div>;
}
