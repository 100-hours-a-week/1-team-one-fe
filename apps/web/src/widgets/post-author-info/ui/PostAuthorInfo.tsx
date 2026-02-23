import { Avatar } from '@repo/ui/avatar';
import { StreakBadge } from '@repo/ui/streak-badge';

import type { PostAuthorType } from '@/src/entities/post';
import StreakImoji from '@/src/shared/assets/streak-imoji.svg';
import {
  formatNotificationDateLabel,
  formatNotificationTimeLabel,
} from '@/src/shared/lib/date/notification-date';
import { buildImageUrl } from '@/src/shared/lib/image';

interface PostAuthorInfoProps {
  author: PostAuthorType;
  createdAt: string;
}

export function PostAuthorInfo({ author, createdAt }: PostAuthorInfoProps) {
  const dateLabel = formatNotificationDateLabel(createdAt);
  const timeLabel = formatNotificationTimeLabel(createdAt);
  const formattedDateTime = `${dateLabel} ${timeLabel}`;

  const profileImageUrl = buildImageUrl(author.profileImageUrl);

  return (
    <div className="flex items-center gap-3 py-4">
      <Avatar
        src={profileImageUrl}
        name={author.nickname}
        size="md"
        badge={
          <StreakBadge
            streak={author.streak}
            icon={<StreakImoji className="h-7 w-7" aria-hidden="true" />}
            size="md"
          />
        }
      />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{author.nickname}</span>
          <span className="text-text-subtle text-sm">Lv.{author.level}</span>
        </div>
        <div className="text-text-subtle flex items-center gap-2 text-sm">
          <time dateTime={createdAt}>{formattedDateTime}</time>
        </div>
      </div>
    </div>
  );
}

PostAuthorInfo.displayName = 'PostAuthorInfo';
