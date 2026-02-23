import { Card } from '@repo/ui/card';

import { buildStretchSessionPath } from '@/src/shared/routes';
import { LinkCard } from '@/src/shared/ui/link-card';

import { APP_MAIN_MESSAGES } from '../config/messages';

type AppMainActiveSessionCardProps = {
  sessionId: number | null;
};

export function AppMainActiveSessionCard({ sessionId }: AppMainActiveSessionCardProps) {
  if (sessionId === null) {
    return (
      <Card padding="none" variant="outline" className="bg-bg border-border border-dotted">
        <div className="relative flex flex-1 flex-col gap-3 p-4">
          {/* 너비 유지를 위한 꼼수 */}
          <div aria-hidden className="flex flex-col gap-1 opacity-0">
            <span className="text-text text-lg font-semibold">
              {APP_MAIN_MESSAGES.ACTIVE_SESSION.TITLE}
            </span>
            <span className="text-text-muted text-sm">
              {APP_MAIN_MESSAGES.ACTIVE_SESSION.DESCRIPTION}
            </span>
          </div>
          <span aria-hidden className="invisible text-sm font-semibold">
            {APP_MAIN_MESSAGES.ACTIVE_SESSION.CTA}
          </span>
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
            <span className="text-text-muted text-sm font-semibold">
              {APP_MAIN_MESSAGES.ACTIVE_SESSION.EMPTY}
            </span>
          </div>
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
