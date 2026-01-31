import { UserStatusCard } from '@repo/ui/user-status-card';

import { useUserProfileQuery } from '@/src/features/user-profile';
import StreakImoji from '@/src/shared/assets/streak-imoji.svg';
const TOTAL_EXP = 1000 as const;

export interface UserStatusCardSectionProps {
  isVisible?: boolean;
}

export function UserStatusCardSection({ isVisible = true }: UserStatusCardSectionProps) {
  const { data } = useUserProfileQuery({ enabled: isVisible });

  if (!isVisible) {
    return null;
  }

  if (!data) {
    return null;
  }

  const nickname = data.profile.nickname;
  const avatarSrc = `${process.env.NEXT_PUBLIC_GCS_BASE_URL}/${data.profile.imagePath}`;
  const { level, streak, exp } = data.character;

  return (
    <section aria-label="프로필 상태">
      <UserStatusCard
        avatarSrc={avatarSrc}
        avatarAlt={`${nickname} 프로필 이미지`}
        nickname={nickname}
        level={level}
        streak={streak}
        streakIcon={<StreakImoji className="h-7 w-7" aria-hidden="true" />}
        currentExp={exp}
        totalExp={TOTAL_EXP}
      />
    </section>
  );
}

UserStatusCardSection.displayName = 'UserStatusCardSection';
