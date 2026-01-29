import { cn } from '@repo/ui/lib/utils';
import { useEffect, useRef } from 'react';

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
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = triggerRef.current;
    if (!target) return;
    if (!isActive) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        onIntersect();
      },
      { rootMargin },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [isActive, onIntersect, rootMargin]);

  return <div ref={triggerRef} className={cn('h-6 w-full', className)} />;
}
