import { useRouter } from 'next/router';
import { useEffect } from 'react';

const QUEST_TAB_VALUES = {
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
} as const;

type QuestTabValue = (typeof QUEST_TAB_VALUES)[keyof typeof QUEST_TAB_VALUES];
type IsCompletedQueryValue = 'true' | 'false';

function normalizeIsCompletedQueryValue(
  value: string | string[] | undefined,
): IsCompletedQueryValue {
  if (value === 'true') return 'true';
  if (value === 'false') return 'false';
  return 'false';
}

function toQuestTabValue(isCompleted: boolean): QuestTabValue {
  if (isCompleted) return QUEST_TAB_VALUES.COMPLETED;
  return QUEST_TAB_VALUES.IN_PROGRESS;
}

function toIsCompletedByTabValue(tabValue: QuestTabValue): boolean {
  if (tabValue === QUEST_TAB_VALUES.COMPLETED) return true;
  return false;
}

/**
 * 탭/쿼리 상태 로직 관리하는 커스텀 훅
 */
export function useQuestTabQueryState() {
  const router = useRouter();
  const isCompletedQuery = normalizeIsCompletedQueryValue(router.query.isCompleted);
  const isCompleted = isCompletedQuery === 'true';
  const selectedTab = toQuestTabValue(isCompleted);

  useEffect(() => {
    if (!router.isReady) return;

    if (
      typeof router.query.isCompleted === 'string' &&
      router.query.isCompleted === isCompletedQuery
    ) {
      return;
    }

    void router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          isCompleted: isCompletedQuery,
        },
      },
      undefined,
      { shallow: true, scroll: false },
    );
  }, [isCompletedQuery, router, router.isReady, router.pathname, router.query]);

  const handleTabValueChange = (value: QuestTabValue) => {
    const nextIsCompleted = toIsCompletedByTabValue(value);
    const nextIsCompletedQuery = nextIsCompleted ? 'true' : 'false';

    if (nextIsCompletedQuery === isCompletedQuery) return;

    void router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          isCompleted: nextIsCompletedQuery,
        },
      },
      undefined,
      { shallow: true, scroll: false },
    );
  };

  return {
    isCompleted,
    selectedTab,
    isReady: router.isReady,
    handleTabValueChange,
    tabValues: QUEST_TAB_VALUES,
  } as const;
}
