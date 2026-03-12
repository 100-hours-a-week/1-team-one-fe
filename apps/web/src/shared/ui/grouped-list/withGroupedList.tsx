import { type ComponentType, type Key, useMemo } from 'react';

import { groupContiguousItems } from '@/src/shared/lib/list';

export interface GroupedListConfig<TItem> {
  getGroupKey: (item: TItem) => string;
  getGroupLabel: (item: TItem) => string;
  getItemKey: (item: TItem) => Key;
}

export interface GroupedListProps<TItem> {
  items: readonly TItem[];
}

/**
 * 아이템 컴포넌트를 받아 날짜(/키) 그룹 리스트 컴포넌트를 생성
 *
 * @remarks
 * `items` 입력은 `getGroupKey`와 동일한 기준으로 사전 정렬되어 있어야 하며,
 * 같은 키 값은 배열에서 연속으로 들어와야 합니다.
 */
export function withGroupedList<TItem>(
  ItemComponent: ComponentType<{ item: TItem }>,
  config: GroupedListConfig<TItem>,
) {
  return function GroupedList({ items }: GroupedListProps<TItem>) {
    const groups = useMemo(() => {
      return groupContiguousItems({
        items,
        getGroupKey: config.getGroupKey,
        getGroupLabel: config.getGroupLabel,
      });
    }, [items]);

    return (
      <div className="flex flex-col gap-3">
        {groups.map((group) => (
          <div key={group.groupKey} className="flex flex-col gap-3">
            <span className="text-text-muted text-xs font-semibold">{group.groupLabel}</span>
            {group.items.map((item) => (
              <ItemComponent key={config.getItemKey(item)} item={item} />
            ))}
          </div>
        ))}
      </div>
    );
  };
}
