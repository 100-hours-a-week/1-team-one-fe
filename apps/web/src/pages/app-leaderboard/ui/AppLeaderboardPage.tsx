import { Card } from '@repo/ui/card';

import { APP_LEADERBOARD_PAGE_MESSAGES } from '../config/messages';

export function AppLeaderboardPage() {
  return (
    <div className="flex min-h-screen flex-col gap-4 px-5 py-4">
      <Card padding="md" variant="elevated" className="border-border bg-bg-subtle">
        <p className="text-text-muted text-sm">{APP_LEADERBOARD_PAGE_MESSAGES.DESCRIPTION}</p>
      </Card>
    </div>
  );
}
