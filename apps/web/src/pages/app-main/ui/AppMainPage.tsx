import { ActivityCalendar } from '@repo/ui/activity-calendar';
import { Card } from '@repo/ui/card';
import Image from 'next/image';
import Link from 'next/link';

import { transformGrassData, useGrassStatsQuery } from '@/src/features/grass-stats';
import { useUserProfileQuery } from '@/src/features/user-profile';
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
  const { data: grassData } = useGrassStatsQuery({ view: 'WEEKLY' });

  const characterStatus = data ? getCharacterStatusByStreak(data.character.streak) : null;
  const characterImage = data
    ? getCharacterImagePath(data.character, characterStatus ?? CHARACTER_STATUS.NORMAL)
    : null;

  const calendarData = grassData ? transformGrassData(grassData.grass) : [];

  return (
    <div className="flex min-h-screen flex-col gap-6 pb-6">
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
      {calendarData.length > 0 && (
        <section className="bg-bg-muted rounded-2xl p-5">
          <ActivityCalendar data={calendarData} />
        </section>
      )}
      <section className="flex gap-3 px-5">
        {APP_MAIN_ACTION_CARDS.map(({ key, href, title, Icon }) => (
          <Link
            key={key}
            href={href}
            className="focus-visible:ring-focus-ring flex-1 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Card
              padding="md"
              variant="elevated"
              className="hover:border-border-strong hover:bg-bg-subtle flex h-32 items-center gap-3 transition-colors"
            >
              <span className="text-brand-700 inline-flex h-10 w-10 items-center justify-center rounded-full">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-text text-lg font-semibold">{title}</span>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
