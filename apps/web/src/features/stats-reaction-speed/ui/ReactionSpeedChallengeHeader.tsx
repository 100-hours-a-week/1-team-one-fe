import { Button } from '@repo/ui/button';
import { cn } from '@repo/ui/lib/utils';
import { Zap } from 'lucide-react';

import type { StatsReactionSpeedViewType } from '@/src/entities/stats';

import { STATS_REACTION_SPEED_FILTERS } from '../config/constants';
import { STATS_REACTION_SPEED_MESSAGES } from '../config/messages';

interface FilterButtonProps {
  isSelected: boolean;
  label: string;
  onClick: () => void;
}

function FilterButton({ isSelected, label, onClick }: FilterButtonProps) {
  return (
    <Button
      type="button"
      variant={isSelected ? 'primary' : 'ghost'}
      className={cn(
        'h-9 w-full rounded-xl text-sm font-medium transition-colors',
        isSelected
          ? 'bg-warning-500 hover:bg-warning-600 active:bg-warning-700 text-white shadow-sm'
          : 'bg-bg-subtle text-text-muted hover:bg-bg-subtle active:bg-bg-subtle',
      )}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

interface ReactionSpeedChallengeHeaderProps {
  selectedView: StatsReactionSpeedViewType;
  onViewChange: (view: StatsReactionSpeedViewType) => void;
}

export function ReactionSpeedChallengeHeader({
  selectedView,
  onViewChange,
}: ReactionSpeedChallengeHeaderProps) {
  const handleFilterClick = (view: StatsReactionSpeedViewType) => {
    if (view === selectedView) return;
    onViewChange(view);
  };

  return (
    <>
      <div>
        <p className="text-text flex items-center gap-2 text-base font-semibold">
          <Zap aria-hidden="true" className="text-warning-600 size-4" />
          <span>{STATS_REACTION_SPEED_MESSAGES.HEADER.TITLE}</span>
        </p>
        <p className="text-text-muted mt-1 text-xs">
          {STATS_REACTION_SPEED_MESSAGES.HEADER.DESCRIPTION}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {STATS_REACTION_SPEED_FILTERS.map((filter) => (
          <FilterButton
            key={filter.value}
            isSelected={selectedView === filter.value}
            label={filter.label}
            onClick={() => handleFilterClick(filter.value)}
          />
        ))}
      </div>
    </>
  );
}
