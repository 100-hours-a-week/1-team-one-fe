import { Card } from '@repo/ui/card';
import { Skeleton } from '@repo/ui/skeleton';

import { buildStretchSessionPath } from '@/src/shared/routes';
import { LinkCard } from '@/src/shared/ui/link-card';

import { APP_MAIN_MESSAGES } from '../config/messages';

type AppMainActiveSessionCardProps = {
  sessionId: number | null;
  isLoading?: boolean;
};

export function AppMainActiveSessionCard({
  sessionId,
  isLoading = false,
}: AppMainActiveSessionCardProps) {
  if (isLoading) {
    return (
      <Card padding="none" variant="outline" className="bg-bg border-border">
        <div className="flex min-h-24 flex-col gap-2 p-4">
          <Skeleton variant="text" className="h-5 w-32" />
          <Skeleton variant="text" className="h-4 w-48" />
        </div>
      </Card>
    );
  }

  if (sessionId === null) {
    return (
      <Card padding="none" variant="outline" className="bg-bg border-border border-dotted">
        <div className="flex min-h-24 flex-col items-center justify-center p-4 text-center">
          <span className="text-text-muted text-sm font-semibold">
            {APP_MAIN_MESSAGES.ACTIVE_SESSION.EMPTY}
          </span>
        </div>
      </Card>
    );
  }

  return (
    <LinkCard
      href={buildStretchSessionPath(sessionId)}
      headerHeight="sm"
      className="hover:border-border-strong hover:bg-bg-subtle transition-colors"
      footer={
        <span className="text-brand-700 text-sm font-semibold">
          {APP_MAIN_MESSAGES.ACTIVE_SESSION.CTA}
        </span>
      }
    >
      <div className="flex flex-col gap-1">
        <span className="text-text text-lg font-semibold">
          {APP_MAIN_MESSAGES.ACTIVE_SESSION.TITLE}
        </span>
        <span className="text-text-muted text-sm">
          {APP_MAIN_MESSAGES.ACTIVE_SESSION.DESCRIPTION}
        </span>
      </div>
    </LinkCard>
  );
}
