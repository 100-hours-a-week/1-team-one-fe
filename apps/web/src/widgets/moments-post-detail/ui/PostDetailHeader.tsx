import { Avatar } from '@repo/ui/avatar';
import { StreakBadge } from '@repo/ui/streak-badge';

import type { PostAuthorType } from '@/src/entities/post';
import { StreakImoji } from '@/src/shared/assets/StreakImoji';
import { AVATAR_IMAGE_QUALITY, AVATAR_IMAGE_SIZES } from '@/src/shared/config/avatar';
import {
  formatNotificationDateLabel,
  formatNotificationTimeLabel,
} from '@/src/shared/lib/date/notification-date';
import { buildImageUrl } from '@/src/shared/lib/image';
import { OptimizedImage } from '@/src/shared/ui/optimized-image';

interface PostDetailHeaderProps {
  author: PostAuthorType;
  createdAt: string;
}

export function PostDetailHeader({ author, createdAt }: PostDetailHeaderProps) {
  const dateLabel = formatNotificationDateLabel(createdAt);
  const timeLabel = formatNotificationTimeLabel(createdAt);
  const formattedDateTime = `${dateLabel} ${timeLabel}`;

  const profileImageUrl = buildImageUrl(author.profileImageUrl);
  const avatarAlt = `${author.nickname} 프로필 이미지`;

  return (
    <div className="flex items-center gap-3 py-4">
      <Avatar
        src={profileImageUrl}
        alt={avatarAlt}
        name={author.nickname}
        size="md"
        imageSlot={
          profileImageUrl ? (
            <OptimizedImage
              src={profileImageUrl}
              alt={avatarAlt}
              fill
              className="object-cover"
              quality={AVATAR_IMAGE_QUALITY.MD}
              sizes={AVATAR_IMAGE_SIZES.MD}
            />
          ) : undefined
        }
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
