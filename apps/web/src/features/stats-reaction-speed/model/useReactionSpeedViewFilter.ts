import { useState } from 'react';

import type { StatsReactionSpeedViewType } from '@/src/entities/stats';

import { STATS_REACTION_SPEED_DEFAULT_VIEW } from '../config/constants';

export function useReactionSpeedViewFilter(
  initialView: StatsReactionSpeedViewType = STATS_REACTION_SPEED_DEFAULT_VIEW,
) {
  const [selectedView, setSelectedView] = useState<StatsReactionSpeedViewType>(initialView);

  const handleViewChange = (nextView: StatsReactionSpeedViewType) => {
    setSelectedView(nextView);
  };

  return {
    selectedView,
    handleViewChange,
  };
}
