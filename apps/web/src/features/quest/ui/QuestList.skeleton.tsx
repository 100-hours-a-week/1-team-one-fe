import { Card } from '@repo/ui/card';
import { Shimmer } from '@repo/ui/shimmer';
import { Skeleton } from '@repo/ui/skeleton';

const QUEST_LIST_SKELETON_COUNT = 3;

function QuestListItemSkeleton({ index }: { index: number }) {
  return (
    <Card
      key={`quest-list-skeleton-${index}`}
      padding="sm"
      variant="elevated"
      className="bg-bg-subtle shadow-none"
    >
      <div className="flex items-start gap-3">
        <Skeleton className="h-20 w-20 shrink-0 rounded-xl" />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Skeleton className="h-5 w-1/2 rounded-md" />

          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-7 w-14 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>

          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-16 rounded-md" />
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function QuestListSkeleton() {
  return (
    <Shimmer>
      <div className="flex flex-col gap-3">
        {Array.from({ length: QUEST_LIST_SKELETON_COUNT }).map((_, index) => (
          <QuestListItemSkeleton key={`quest-list-skeleton-${index}`} index={index} />
        ))}
      </div>
    </Shimmer>
  );
}
