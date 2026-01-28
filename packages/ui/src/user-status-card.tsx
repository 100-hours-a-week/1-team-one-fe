import type React from 'react';

import { Avatar } from './avatar';
import { Card } from './card';
import { Chip } from './chip';
import { cn } from './lib/utils';
import { ProgressBar } from './progress-bar';

export interface UserStatusCardProps extends Omit<
  React.ComponentPropsWithoutRef<'section'>,
  'children'
> {
  avatarSrc?: string | null;
  avatarAlt?: string;
  nickname: string;
  level: number;
  streak: number;
  currentExp: number;
  totalExp: number;
  streakIcon?: React.ReactNode;
}

const getLevelLabel = (level: number) => {
  if (Number.isNaN(level)) return 'Lv. 0';
  return `Lv. ${Math.max(0, Math.floor(level))}`;
};

const getSafeStreak = (streak: number) => {
  if (Number.isNaN(streak)) return 0;
  return Math.max(0, Math.floor(streak));
};

function StreakBadge({ streak, icon }: { streak: number; icon?: React.ReactNode }) {
  const safeStreak = getSafeStreak(streak);
  const resolvedIcon = icon ?? (
    <span className="text-xl" aria-hidden="true">
      🔥
    </span>
  );

  return (
    <span className="relative inline-flex h-7 w-7 items-center justify-center">
      <span className="flex h-full w-full items-center justify-center" aria-hidden="true">
        {resolvedIcon}
      </span>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold tabular-nums">
        {safeStreak}
      </span>
    </span>
  );
}

export function UserStatusCard({
  avatarSrc,
  avatarAlt,
  nickname,
  level,
  streak,
  currentExp,
  totalExp,
  streakIcon,
  className,
  ...props
}: UserStatusCardProps) {
  return (
    <Card padding="md" variant="elevated" className={cn('w-full', className)} {...props}>
      <div className="flex items-start justify-between gap-4">
        <Avatar src={avatarSrc} alt={avatarAlt ?? nickname} name={nickname} size="md" />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="justify-first flex items-center gap-2">
            <Chip
              label={getLevelLabel(level)}
              className="bg-brand text-brand-contrast border-brand"
            />
            <div className="flex min-w-0 items-center gap-2">
              <span className="text-text truncate text-base font-semibold">{nickname}</span>
              <StreakBadge streak={streak} icon={streakIcon} />
            </div>
          </div>
          <ProgressBar
            current={currentExp}
            total={totalExp}
            variant="bar"
            showValue
            unitLabel="exp"
            className="w-full"
          />
        </div>
      </div>
    </Card>
  );
}

UserStatusCard.displayName = 'UserStatusCard';
