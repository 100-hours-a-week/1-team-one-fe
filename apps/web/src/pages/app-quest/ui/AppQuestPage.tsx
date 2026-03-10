import { Card } from '@repo/ui/card';
import { type MenuTabItem, MenuTabs } from '@repo/ui/menu-tabs';
import { useMemo } from 'react';

import type { QuestItemType } from '@/src/entities/quest';
import { QuestList, QuestListSkeleton, useMeQuestsQuery } from '@/src/features/quest';
import { LoadableBoundary } from '@/src/shared/ui/boundary';

import { APP_QUEST_PAGE_MESSAGES } from '../config/messages';
import { useQuestTabQueryState } from '../model/useQuestTabQueryState';

type QuestTabValue = ReturnType<typeof useQuestTabQueryState>['selectedTab'];

interface QuestTabPanelProps {
  items: readonly QuestItemType[] | undefined;
  isLoading: boolean;
  error: unknown;
  emptyMessage: string;
  groupByFinishedDate?: boolean;
}

function QuestTabPanel({
  items,
  isLoading,
  error,
  emptyMessage,
  groupByFinishedDate = false,
}: QuestTabPanelProps) {
  const isEmpty = Array.isArray(items) && items.length === 0;

  return (
    <LoadableBoundary
      isLoading={isLoading}
      error={error}
      data={items}
      isEmpty={isEmpty}
      renderLoading={() => <QuestListSkeleton />}
      renderError={() => (
        <Card padding="md" variant="elevated" className="bg-bg-subtle border-0 shadow-none">
          <p className="text-error text-sm">{APP_QUEST_PAGE_MESSAGES.STATE.ERROR}</p>
        </Card>
      )}
      renderEmpty={() => (
        <div className="text-text-muted py-8 text-center text-sm">{emptyMessage}</div>
      )}
    >
      {(resolvedItems) => (
        <QuestList items={resolvedItems} groupByFinishedDate={groupByFinishedDate} />
      )}
    </LoadableBoundary>
  );
}

export function AppQuestPage() {
  const { isCompleted, selectedTab, isReady, handleTabValueChange, tabValues } =
    useQuestTabQueryState();
  const {
    data,
    isLoading,
    error: queryError,
  } = useMeQuestsQuery({ isCompleted }, { enabled: isReady });
  const quests = data?.quests;
  const isBoundaryLoading = !isReady || isLoading;

  const menus = useMemo<ReadonlyArray<MenuTabItem<QuestTabValue>>>(() => {
    return [
      {
        value: tabValues.IN_PROGRESS,
        label: APP_QUEST_PAGE_MESSAGES.TABS.IN_PROGRESS.LABEL,
        content: (
          <QuestTabPanel
            items={quests}
            isLoading={isBoundaryLoading}
            error={queryError}
            emptyMessage={APP_QUEST_PAGE_MESSAGES.TABS.IN_PROGRESS.EMPTY}
            groupByFinishedDate={false}
          />
        ),
      },
      {
        value: tabValues.COMPLETED,
        label: APP_QUEST_PAGE_MESSAGES.TABS.COMPLETED.LABEL,
        content: (
          <QuestTabPanel
            items={quests}
            isLoading={isBoundaryLoading}
            error={queryError}
            emptyMessage={APP_QUEST_PAGE_MESSAGES.TABS.COMPLETED.EMPTY}
            groupByFinishedDate
          />
        ),
      },
    ];
  }, [isBoundaryLoading, queryError, quests, tabValues.COMPLETED, tabValues.IN_PROGRESS]);

  return (
    <div className="flex min-h-screen flex-col gap-4 px-5 py-4">
      {/* TODO description 공통 컴포넌트 개발 */}
      <div className="flex flex-col gap-1">
        <p className="text-text-muted text-sm">{APP_QUEST_PAGE_MESSAGES.HEADER.DESCRIPTION}</p>
      </div>

      <MenuTabs menus={menus} value={selectedTab} onValueChange={handleTabValueChange} />
    </div>
  );
}
