import { cn } from '@repo/ui/lib/utils';

import { useInfiniteScroll } from '@/src/shared/lib/intersection';

type InfiniteScrollTriggerProps = {
  onIntersect: () => void;
  isActive: boolean;
  rootMargin?: string;
  className?: string;
};

export function InfiniteScrollTrigger({
  onIntersect,
  isActive,
  rootMargin = '0px',
  className,
}: InfiniteScrollTriggerProps) {
  const triggerRef = useInfiniteScroll({ onIntersect, isActive, rootMargin });

  return <div ref={triggerRef} className={cn('h-6 w-full', className)} />;
}

InfiniteScrollTrigger.displayName = 'InfiniteScrollTrigger';
