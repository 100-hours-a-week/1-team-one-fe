import { Avatar } from '@repo/ui/avatar';

import type { PostAuthor } from '@/src/entities/post';
import {
  formatNotificationDateLabel,
  formatNotificationTimeLabel,
} from '@/src/shared/lib/date/notification-date';

interface PostDetailHeaderProps {
  author: PostAuthor;
  createdAt: string;
}

export function PostDetailHeader({ author, createdAt }: PostDetailHeaderProps) {
  const dateLabel = formatNotificationDateLabel(createdAt);
  const timeLabel = formatNotificationTimeLabel(createdAt);
  const formattedDateTime = `${dateLabel} ${timeLabel}`;

  return (
    <div className="flex items-center gap-3 py-4">
      <Avatar src={author.profileImageUrl} name={author.nickname} size="md" />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{author.nickname}</span>
          <span className="text-text-subtle text-sm">Lv.{author.level}</span>
        </div>
        <div className="text-text-subtle flex items-center gap-2 text-sm">
          <span>{author.streak}일 연속</span>
          <span>•</span>
          <time dateTime={createdAt}>{formattedDateTime}</time>
        </div>
      </div>
    </div>
  );
}
