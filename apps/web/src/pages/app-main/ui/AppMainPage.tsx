import { ActivityCalendar } from '@repo/ui/activity-calendar';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

import { transformGrassData, useGrassStatsQuery } from '@/src/features/grass-stats';
import { useUserProfileQuery } from '@/src/features/user-profile';
import { LinkCard } from '@/src/shared/ui/LinkCard';
import { UserStatusCardSection } from '@/src/widgets/user-status-card';

import { APP_MAIN_ACTION_CARDS } from '../config/action-cards';
import {
  CHARACTER_STATUS,
  getCharacterImagePath,
  getCharacterStatusByStreak,
} from '../config/character-status';
import { APP_MAIN_MESSAGES } from '../config/messages';

export function AppMainPage() {
  const { data } = useUserProfileQuery();
  const { data: grassData } = useGrassStatsQuery({
    view: 'WEEKLY',
  });

  const characterStatus = data ? getCharacterStatusByStreak(data.character.streak) : null;
  const characterImage = data
    ? getCharacterImagePath(data.character, characterStatus ?? CHARACTER_STATUS.NORMAL)
    : null;

  const calendarData = grassData ? transformGrassData(grassData.grass) : [];

  return (
    <div className="flex flex-col gap-6 pb-6">
      <UserStatusCardSection />
      <section className="flex flex-col items-center justify-center px-5">
        {characterImage && (
          <Image
            src={characterImage}
            alt={APP_MAIN_MESSAGES.CHARACTER_IMAGE_ALT}
            width={400}
            height={300}
          />
        )}
        <p className="text-xl font-semibold">{data?.character.name}</p>
      </section>
      <section className="bg-bg-muted rounded-lg p-3">
        {calendarData.length > 0 && <ActivityCalendar data={calendarData} />}
      </section>
      <section className="flex gap-3">
        {APP_MAIN_ACTION_CARDS.map(({ key, href, title, image, description }) => (
          <div key={key} className="flex-1">
            <LinkCard
              href={href}
              headerHeight="md"
              className="hover:border-border-strong hover:bg-bg-subtle transition-colors"
              header={
                <div className="flex h-full w-full items-center justify-center">
                  <Image src={image} alt={title} width={48} height={48} />
                </div>
              }
              footer={
                <div>
                  <span className="text-sm">{description}</span>
                </div>
              }
            >
              <div className="text-text flex items-center justify-between text-center text-lg font-semibold">
                {title}
                <ChevronRight className="ml-2" />
              </div>
            </LinkCard>
          </div>
        ))}
      </section>
    </div>
  );
}
