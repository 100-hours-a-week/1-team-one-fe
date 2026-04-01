import type { ExerciseSessionReportListItemType } from '@/src/entities/exercise-session-report';
import { formatDateLabel, getDateKey } from '@/src/shared/lib/date/display-date';
import { withGroupedList } from '@/src/shared/ui/grouped-list';

import { ReportItem } from './ReportItem';

type ReportListProps = {
  items: ReadonlyArray<ExerciseSessionReportListItemType>;
};

const GroupedReportItems = withGroupedList(ReportItem, {
  getGroupKey: (item) => getDateKey(item.createdAt),
  getGroupLabel: (item) => formatDateLabel(item.createdAt),
  getItemKey: (item) => item.sessionReportId,
});

export function ReportList({ items }: ReportListProps) {
  return <GroupedReportItems items={items} />;
}
