import { Skeleton } from '@repo/ui/skeleton';

export function ReactionSpeedChallengePanelSkeleton() {
  return (
    <div className="bg-surface mt-3 rounded-2xl px-4 py-5">
      <div className="flex flex-col items-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-12 w-24" />
        <Skeleton className="mt-2 h-6 w-8" />
      </div>

      <div className="mt-6">
        <Skeleton className="mx-auto h-4 w-28" />
        <Skeleton className="mt-3 h-10 w-full rounded-full" />
        <div className="mt-2 grid grid-cols-3 gap-2">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="mx-auto h-3 w-8" />
          <Skeleton className="ml-auto h-3 w-8" />
        </div>
      </div>

      <Skeleton className="mx-auto mt-6 h-16 w-36 rounded-full" />
    </div>
  );
}
