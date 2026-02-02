import { ActivityCalendar } from '@repo/ui/activity-calendar';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

import { useValidExerciseSessionsQuery } from '@/src/features/exercise-session';
import { transformGrassData, useGrassStatsQuery } from '@/src/features/grass-stats';
import { useUserProfileQuery } from '@/src/features/user-profile';
import { LoadableBoundary } from '@/src/shared/ui/boundary';
import { ErrorScreen } from '@/src/shared/ui/error-screen';
import { LinkCard } from '@/src/shared/ui/LinkCard';
import { UserStatusCardSection } from '@/src/widgets/user-status-card';

import { APP_MAIN_ACTION_CARDS } from '../config/action-cards';
import { AppMainActiveSessionCard } from './AppMainActiveSessionCard';
import { AppMainCharacterSection } from './AppMainCharacterSection';
import { AppMainPageSkeleton } from './AppMainPage.skeleton';

export function AppMainPage() {
  const userQuery = useUserProfileQuery();
  const grassQuery = useGrassStatsQuery({
    view: 'WEEKLY',
  });
  const validSessionsQuery = useValidExerciseSessionsQuery();

  //로딩 처리를 위한 쿼리 결합
  const isLoading = userQuery.isLoading || grassQuery.isLoading || validSessionsQuery.isLoading;
  const error = userQuery.error ?? grassQuery.error ?? validSessionsQuery.error;
  const hasAllData =
    userQuery.data !== undefined &&
    grassQuery.data !== undefined &&
    validSessionsQuery.data !== undefined;

  return (
    <LoadableBoundary
      isLoading={isLoading}
      error={error}
      data={
        hasAllData
          ? {
              user: userQuery.data,
              grass: grassQuery.data,
              validSessions: validSessionsQuery.data,
            }
          : undefined
      }
      renderLoading={() => <AppMainPageSkeleton />}
      renderError={() => <ErrorScreen variant="unexpected" />}
    >
      {({ user, grass, validSessions }) => {
        const calendarData = transformGrassData(grass.grass);
        const activeSession = validSessions?.[0] ?? null;

        return (
          <div className="flex flex-col gap-6 p-6 pb-20">
            <UserStatusCardSection />
            <AppMainCharacterSection
              characterName={user.character.name}
              characterType={user.character.type}
              statusScore={user.character.statusScore}
            />
            <section className="bg-surface rounded-lg p-3">
              <div className="text-text flex items-center justify-between pb-3 text-center text-lg font-semibold">
                스트레칭 기록
              </div>
              {calendarData.length > 0 && <ActivityCalendar data={calendarData} />}
            </section>
            <AppMainActiveSessionCard sessionId={activeSession?.sessionId ?? null} />
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
      }}
    </LoadableBoundary>
  );
}
