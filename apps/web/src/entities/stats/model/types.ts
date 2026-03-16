export type StatsSummaryDataType = {
  streak: number;
  todaySuccess: number;
  weeklySuccess: number;
  lastWeekSuccess: number;
};

export type StatsReactionSpeedViewType = 'WEEKLY' | 'MONTHLY' | 'TOTAL';

export type StatsReactionSpeedDataType = {
  speed: number | null;
  rate: number | null;
};

export type StatsReactionSpeedQueryParamsType = {
  view: StatsReactionSpeedViewType;
};
