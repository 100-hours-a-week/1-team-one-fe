import { Card } from '@repo/ui/card';

import { LoadableBoundary } from '@/src/shared/ui/boundary';

import { useStatsReactionSpeedQuery } from '../api/useStatsReactionSpeedQuery';
import { STATS_REACTION_SPEED_MESSAGES } from '../config/messages';
import { buildReactionSpeedViewModel } from '../model/build-reaction-speed-vm';
import { useReactionSpeedViewFilter } from '../model/useReactionSpeedViewFilter';
import { ReactionSpeedChallengeContent } from './ReactionSpeedChallengeContent';
import { ReactionSpeedChallengeHeader } from './ReactionSpeedChallengeHeader';
import { ReactionSpeedChallengePanelSkeleton } from './ReactionSpeedChallengePanel.skeleton';

function ReactionSpeedErrorState() {
  return (
    <div className="bg-surface mt-3 rounded-2xl px-4 py-5">
      <p className="text-error-600 text-sm">
        {STATS_REACTION_SPEED_MESSAGES.STATE.UNEXPECTED_ERROR}
      </p>
    </div>
  );
}

export function ReactionSpeedChallengePanel() {
  const { selectedView, handleViewChange } = useReactionSpeedViewFilter();
  const reactionSpeedQuery = useStatsReactionSpeedQuery({
    view: selectedView,
  });

  return (
    <Card variant="elevated" padding="md" className="bg-warning-50 shadow-none">
      <ReactionSpeedChallengeHeader selectedView={selectedView} onViewChange={handleViewChange} />

      <LoadableBoundary
        isLoading={reactionSpeedQuery.isLoading}
        isFetching={reactionSpeedQuery.isFetching}
        error={reactionSpeedQuery.error}
        data={reactionSpeedQuery.data}
        skipDelay
        renderLoading={() => <ReactionSpeedChallengePanelSkeleton />}
        renderError={() => <ReactionSpeedErrorState />}
      >
        {(reactionSpeed) => (
          <ReactionSpeedChallengeContent viewModel={buildReactionSpeedViewModel(reactionSpeed)} />
        )}
      </LoadableBoundary>
    </Card>
  );
}
