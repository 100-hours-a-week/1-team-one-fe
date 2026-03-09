import { Card } from '@repo/ui/card';
import { useRouter } from 'next/router';

import { STRETCH_SESSION_RESULT_PAGE_MESSAGES } from '../config/messages';

export function StretchSessionResultPage() {
  const router = useRouter();
  const sessionId = router.query.sessionId;
  const sessionIdLabel = typeof sessionId === 'string' ? sessionId : '-';

  return (
    <div className="flex h-full w-full items-center justify-center px-6">
      <Card variant="elevated" padding="lg" className="w-full max-w-md border-0 text-center">
        <h1 className="text-text text-xl font-semibold">
          {STRETCH_SESSION_RESULT_PAGE_MESSAGES.TITLE}
        </h1>
        <p className="text-text-muted mt-2 text-sm">
          {STRETCH_SESSION_RESULT_PAGE_MESSAGES.DESCRIPTION}
        </p>
        <p className="text-text mt-4 text-sm font-medium">
          {STRETCH_SESSION_RESULT_PAGE_MESSAGES.SESSION_ID_LABEL}: {sessionIdLabel}
        </p>
      </Card>
    </div>
  );
}
