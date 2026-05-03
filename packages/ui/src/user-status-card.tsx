import type React from 'react';

import { Avatar } from './avatar';
import { Card } from './card';
import { Chip } from './chip';
import { cn } from './lib/utils';
import { ProgressBar } from './progress-bar';
import { StreakBadge } from './streak-badge';

export interface UserStatusCardProps extends Omit<
  React.ComponentPropsWithoutRef<'section'>,
  'children'
> {
  avatarSrc?: string | null;
  avatarAlt?: string;
  avatarImageSlot?: React.ReactNode;
  nickname: string;
  level: number;
  streak: number;
  currentExp: number;
  totalExp: number;
  streakIcon?: React.ReactNode;
  avatarBadge?: React.ReactNode;
  rightContent?: React.ReactNode;
  rightContentClassName?: string;
}

const getLevelLabel = (level: number) => {
  if (Number.isNaN(level)) return 'Lv. 0';
  return `Lv. ${Math.max(0, Math.floor(level))}`;
};

export function UserStatusCard({
  avatarSrc,
  avatarAlt,
  avatarImageSlot,
  nickname,
  level,
  streak,
  currentExp,
  totalExp,
  streakIcon,
  avatarBadge,
  rightContent,
  rightContentClassName,
  className,
  ...props
}: UserStatusCardProps) {
  return (
    <Card padding="md" variant="elevated" className={cn('w-full', className)} {...props}>
      <div className="flex items-start justify-between gap-4">
        <Avatar
          src={avatarSrc}
          alt={avatarAlt ?? nickname}
          name={nickname}
          size="md"
          imageSlot={avatarImageSlot}
          badge={avatarBadge ?? <StreakBadge streak={streak} icon={streakIcon} size="md" />}
        />
        <div className={cn('flex min-w-0 flex-1 flex-col gap-3', rightContentClassName)}>
          {rightContent ?? (
            <>
              <div className="justify-first flex items-center gap-2">
                <Chip
                  label={getLevelLabel(level)}
                  className="bg-brand text-brand-contrast border-brand"
                />
                <span className="text-text truncate text-base font-semibold">{nickname}</span>
              </div>
              <ProgressBar
                current={currentExp}
                total={totalExp}
                variant="bar"
                showValue
                unitLabel="exp"
                className="w-full"
              />
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

UserStatusCard.displayName = 'UserStatusCard';
