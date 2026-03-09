import { useMemo } from 'react';

import type { ExerciseSessionReportListItemType } from '@/src/entities/exercise-session-report';
import { formatDateLabel, getDateKey } from '@/src/shared/lib/date/display-date';

import { ReportItem } from './ReportItem';

type ReportListProps = {
  items: ReadonlyArray<ExerciseSessionReportListItemType>;
};

export function ReportList({ items }: ReportListProps) {
  const groupedItems = useMemo(() => {
    return items.reduce<
      Array<{
        dateKey: string;
        label: string;
        items: ExerciseSessionReportListItemType[];
      }>
    >((accumulator, item) => {
      const dateKey = getDateKey(item.createdAt);
      const lastGroup = accumulator[accumulator.length - 1];

      if (!lastGroup || lastGroup.dateKey !== dateKey) {
        accumulator.push({
          dateKey,
          label: formatDateLabel(item.createdAt),
          items: [item],
        });
        return accumulator;
      }

      lastGroup.items.push(item);
      return accumulator;
    }, []);
  }, [items]);

  return (
    <div className="flex flex-col gap-3">
      {groupedItems.map((group) => (
        <div key={group.dateKey} className="flex flex-col gap-3">
          <span className="text-text-muted text-xs font-semibold">{group.label}</span>
          {group.items.map((item) => (
            <ReportItem key={item.sessionReportId} item={item} />
          ))}
        </div>
      ))}
    </div>
  );
}
