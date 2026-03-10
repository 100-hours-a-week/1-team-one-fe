import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Chip } from '@repo/ui/chip';
import { ProgressBar } from '@repo/ui/progress-bar';

import type { QuestItemType } from '@/src/entities/quest';
import { formatFutureDaysLabel, formatRelativeTimeLabel } from '@/src/shared/lib/date/display-date';
import { OptimizedImage } from '@/src/shared/ui/optimized-image';

import { getQuestTypeBadgeClassName, getQuestTypeLabel } from '../config/constants';
import { QUEST_MESSAGES } from '../config/messages';

interface QuestListItemProps {
  item: QuestItemType;
}

function formatRewardChipLabel(rewardExp: number): string {
  return `${QUEST_MESSAGES.ITEM.CHIP.REWARD_PREFIX} ${rewardExp} ${QUEST_MESSAGES.ITEM.CHIP.REWARD_UNIT}`;
}

function formatDueChipLabel(finishedAt: string): string {
  const futureDaysLabel = formatFutureDaysLabel(finishedAt);
  if (futureDaysLabel) {
    return `${QUEST_MESSAGES.ITEM.CHIP.DUE_PREFIX} ${futureDaysLabel}`;
  }

  return `${QUEST_MESSAGES.ITEM.CHIP.DUE_PREFIX} ${formatRelativeTimeLabel(finishedAt)}`;
}

export function QuestListItem({ item }: QuestListItemProps) {
  const typeLabel = getQuestTypeLabel(item.type);
  const typeBadgeClassName = getQuestTypeBadgeClassName(item.type);

  return (
    <Card padding="sm" variant="elevated" className="bg-bg-subtle border-0 shadow-none">
      <div className="flex items-start gap-3">
        <div className="bg-bg-muted relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
          <OptimizedImage
            src={item.questImagePath}
            alt={`${item.name} ${QUEST_MESSAGES.ITEM.IMAGE_ALT_SUFFIX}`}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <CardHeader className="space-y-0 p-0">
            <CardTitle className="text-text line-clamp-1 text-base tracking-normal">
              {item.name}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-wrap gap-2 p-0">
            <Chip label={typeLabel} size="sm" className={typeBadgeClassName} />
            <Chip label={formatRewardChipLabel(item.rewardExp)} size="sm" />
            <Chip label={formatDueChipLabel(item.finishedAt)} size="sm" />
          </CardContent>

          <CardContent className="p-0">
            <ProgressBar
              variant="bar"
              size="md"
              total={item.targetCount}
              current={item.currentCount}
              ariaLabel={QUEST_MESSAGES.ITEM.PROGRESS.ARIA_LABEL}
              unitLabel={QUEST_MESSAGES.ITEM.PROGRESS.UNIT_LABEL}
              showValue
            />
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
