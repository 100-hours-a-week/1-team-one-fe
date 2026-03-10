export interface ContiguousGroup<TItem> {
  groupKey: string;
  groupLabel: string;
  items: TItem[];
}

interface GroupContiguousItemsArgs<TItem> {
  items: readonly TItem[];
  getGroupKey: (item: TItem) => string;
  getGroupLabel: (item: TItem) => string;
}

/**
 * 입력 순서를 유지하면서 연속된 동일 키 기준으로 아이템을 그룹화하는 유틸
 *
 * @remarks
 * `items`는 `getGroupKey`와 동일한 기준으로 사전 정렬되어 있어야 합니다.
 * 같은 키 값은 배열에서 연속으로 나타나야 합니다.
 */
export function groupContiguousItems<TItem>({
  items,
  getGroupKey,
  getGroupLabel,
}: GroupContiguousItemsArgs<TItem>): ContiguousGroup<TItem>[] {
  return items.reduce<ContiguousGroup<TItem>[]>((accumulator, item) => {
    const groupKey = getGroupKey(item);
    const lastGroup = accumulator[accumulator.length - 1];

    if (!lastGroup || lastGroup.groupKey !== groupKey) {
      accumulator.push({
        groupKey,
        groupLabel: getGroupLabel(item),
        items: [item],
      });
      return accumulator;
    }

    lastGroup.items.push(item);
    return accumulator;
  }, []);
}
