import type { QuestItemType } from '@/src/entities/quest';
import { formatDateLabel, getDateKey } from '@/src/shared/lib/date/display-date';
import { withGroupedList } from '@/src/shared/ui/grouped-list';

import { QuestListItem } from './QuestListItem';

const GroupedQuestListItems = withGroupedList(QuestListItem, {
  getGroupKey: (item) => getDateKey(item.finishedAt),
  getGroupLabel: (item) => formatDateLabel(item.finishedAt),
  getItemKey: (item) => item.questId,
});

interface QuestListProps {
  items: readonly QuestItemType[];

  groupByFinishedDate?: boolean; //완료 목록처럼 날짜별 구간 헤더가 필요한 경우 활성화
}

export function QuestList({ items, groupByFinishedDate = false }: QuestListProps) {
  if (groupByFinishedDate) {
    return <GroupedQuestListItems items={items} />;
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <QuestListItem key={item.questId} item={item} />
      ))}
    </div>
  );
}
