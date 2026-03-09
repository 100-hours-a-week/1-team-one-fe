import { Button } from '@repo/ui/button';
import { Home, ListChecks } from 'lucide-react';
import Link from 'next/link';

import { ROUTES } from '@/src/shared/routes';

import { STRETCHING_SESSION_COMPLETION_MESSAGES } from '../config/messages';

export function StretchingSessionCompletionNavigation() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button asChild variant="ghost" size="lg" className="bg-bg-subtle w-full border-0">
        <Link href={ROUTES.MAIN} aria-label={STRETCHING_SESSION_COMPLETION_MESSAGES.HOME_ICON_ARIA}>
          <Home className="h-5 w-5" aria-hidden="true" />
          <span>{STRETCHING_SESSION_COMPLETION_MESSAGES.HOME_LABEL}</span>
        </Link>
      </Button>

      <Button asChild variant="ghost" size="lg" className="bg-bg-subtle w-full border-0">
        <Link
          href={ROUTES.REPORTS}
          aria-label={STRETCHING_SESSION_COMPLETION_MESSAGES.RESULT_ICON_ARIA}
        >
          <ListChecks className="h-5 w-5" aria-hidden="true" />
          <span>{STRETCHING_SESSION_COMPLETION_MESSAGES.RESULT_LABEL}</span>
        </Link>
      </Button>
    </div>
  );
}
