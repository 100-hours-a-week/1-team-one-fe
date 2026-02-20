import { useEffect, useRef } from 'react';

type UseInfiniteScrollParams = {
  onIntersect: () => void;
  isActive: boolean;
  rootMargin?: string;
};

export function useInfiniteScroll({
  onIntersect,
  isActive,
  rootMargin = '0px',
}: UseInfiniteScrollParams) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const onIntersectRef = useRef(onIntersect);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    if (!isActive) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        onIntersectRef.current();
      },
      { rootMargin },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [isActive, rootMargin]);

  return targetRef;
}
