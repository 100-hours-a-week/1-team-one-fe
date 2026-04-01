import { ActivityCalendar } from '@repo/ui/activity-calendar';
import { cn } from '@repo/ui/lib/utils';
import { Skeleton } from '@repo/ui/skeleton';
import { ChevronRight } from 'lucide-react';

import { transformGrassData, useGrassStatsQuery } from '@/src/features/grass-stats';
import { useValidStretchingSessionsQuery } from '@/src/features/stretching-session/query';
import { useUserProfileQuery } from '@/src/features/user-profile/query';
import { LoadableBoundary } from '@/src/shared/ui/boundary';
import { ErrorScreen } from '@/src/shared/ui/error-screen';
import { LinkCard } from '@/src/shared/ui/link-card';
import { OptimizedImage } from '@/src/shared/ui/optimized-image';
import { UserStatusCardSection } from '@/src/widgets/user-status-card';

import { APP_MAIN_ACTION_CARDS } from '../config/action-cards';
import { AppMainActiveSessionCard } from './AppMainActiveSessionCard';
import { AppMainCharacterSection } from './AppMainCharacterSection';
import { AppMainCharacterSectionSkeleton } from './AppMainCharacterSection.skeleton';

export function AppMainPage() {
  const userQuery = useUserProfileQuery();
  const grassQuery = useGrassStatsQuery({
    view: 'WEEKLY',
  });
  const validSessionsQuery = useValidStretchingSessionsQuery();

  const calendarData = grassQuery.data ? transformGrassData(grassQuery.data.grass) : [];
  const activeSession = validSessionsQuery.data?.[0] ?? null;

  return (
    <div className="flex flex-col gap-6 p-6">
      <UserStatusCardSection />

      <LoadableBoundary
        isLoading={userQuery.isLoading}
        error={userQuery.error}
        data={userQuery.data}
        skipDelay
        renderLoading={() => <AppMainCharacterSectionSkeleton />}
        renderError={() => <ErrorScreen variant="unexpected" />}
      >
        {(user) => (
          <AppMainCharacterSection
            characterName={user.character.name}
            characterType={user.character.type}
            statusScore={user.character.statusScore}
          />
        )}
      </LoadableBoundary>

      <section className="bg-surface rounded-lg p-3">
        <div className="text-text flex items-center justify-between pb-3 text-center text-lg font-semibold">
          스트레칭 기록
        </div>
        {grassQuery.isLoading ? (
          <div className="flex w-full gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} variant="rect" className="aspect-square flex-1 rounded" />
            ))}
          </div>
        ) : (
          calendarData.length > 0 && <ActivityCalendar data={calendarData} />
        )}
      </section>

      <AppMainActiveSessionCard
        sessionId={validSessionsQuery.isLoading ? null : (activeSession?.sessionId ?? null)}
        isLoading={validSessionsQuery.isLoading}
      />

      <section className="grid grid-cols-2 gap-3">
        {APP_MAIN_ACTION_CARDS.map(
          ({ key, href, title, image, description, containerClassName }) => (
            <div key={key} className={cn('col-span-1', containerClassName)}>
              <LinkCard
                href={href}
                headerHeight="md"
                className="hover:border-border-strong hover:bg-bg-subtle transition-colors"
                header={
                  <div className="flex h-full w-full items-center justify-center">
                    <OptimizedImage src={image} alt={title} width={48} height={48} />
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
          ),
        )}
      </section>
    </div>
  );
}
