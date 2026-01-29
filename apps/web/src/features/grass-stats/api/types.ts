import type { ApiResponse } from '@/src/shared/api';

export type GrassStatsItem = {
  date: string;
  targetCount: number;
  successCount: number;
};

export type GrassStatsData = {
  grass: GrassStatsItem[];
};

export type GrassStatsResponse = ApiResponse<GrassStatsData>;

export type GrassStatsViewType = 'WEEKLY' | 'MONTHLY';

export type GrassStatsQueryParams = {
  view: GrassStatsViewType;
  month?: string;
};
