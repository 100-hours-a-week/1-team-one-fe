import { Shimmer } from '@repo/ui/shimmer';
import { Skeleton } from '@repo/ui/skeleton';
import { SkeletonCard } from '@repo/ui/skeleton-card';
import { SkeletonText } from '@repo/ui/skeleton-text';

const OPTION_COUNT = 4;

export function OnboardingSurveyFormSkeleton() {
  return (
    <Shimmer>
      <div className="flex h-full flex-col justify-evenly gap-20 p-6">
        <header className="flex flex-col items-center gap-2 text-center">
          <SkeletonText lines={1} widths={['45%']} />
          <SkeletonText lines={1} widths={['60%']} />
        </header>

        <div className="flex flex-col gap-4">
          <SkeletonCard padding="md" className="h-24" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: OPTION_COUNT }).map((_, index) => (
              <Skeleton key={`survey-option-${index}`} className="h-12 w-full rounded-md" />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </Shimmer>
  );
}
