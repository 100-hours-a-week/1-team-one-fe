import { Card } from '@repo/ui/card';
import { Chip } from '@repo/ui/chip';

type StretchingSessionResultRewardCardProps = {
  title: string;
  badgeLabel: string;
  expLabel: string;
  statusScoreLabel: string;
  earnedExp: number;
  earnedStatusScore: number;
  deltaPrefix: string;
};

function formatDeltaValue(value: number, prefix: string) {
  return `${prefix}${value}`;
}

export function StretchingSessionResultRewardCard({
  title,
  badgeLabel,
  expLabel,
  statusScoreLabel,
  earnedExp,
  earnedStatusScore,
  deltaPrefix,
}: StretchingSessionResultRewardCardProps) {
  return (
    <Card
      padding="md"
      variant="elevated"
      className="animate-result-fade animate-result-delay-2 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-text text-sm font-semibold">{title}</span>
        <Chip label={badgeLabel} size="sm" className="bg-brand-50 text-brand-700" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {earnedExp > 0 && (
          <div className="bg-bg-subtle flex flex-col gap-1 rounded-lg px-3 py-2">
            <span className="text-text-muted text-xs">{expLabel}</span>
            <span className="text-brand-700 text-lg font-bold">
              {formatDeltaValue(earnedExp, deltaPrefix)}
            </span>
          </div>
        )}
        {earnedStatusScore > 0 && (
          <div className="bg-bg-subtle flex flex-col gap-1 rounded-lg px-3 py-2">
            <span className="text-text-muted text-xs">{statusScoreLabel}</span>
            <span className="text-brand-700 text-lg font-bold">
              {formatDeltaValue(earnedStatusScore, deltaPrefix)}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
