import { Skeleton } from '@repo/ui/skeleton';
import { SkeletonText } from '@repo/ui/skeleton-text';

export function AppMainCharacterSectionSkeleton() {
  return (
    <section className="flex flex-col items-center justify-center px-5">
      <SkeletonText lines={1} widths={['30%']} className="mb-3" />
      <Skeleton variant="rect" className="my-6 h-[300px] w-[300px] max-w-full rounded-xl" />
      <SkeletonText lines={1} widths={['30%']} />
    </section>
  );
}
