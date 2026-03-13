export type WeeklySuccessTone = 'neutral' | 'brand' | 'success';

export type WeeklyDeltaDirection = 'up' | 'down' | 'same';

export type StatsSummaryViewModel = {
  streak: number;
  todaySuccess: number;
  weeklySuccess: number;
  lastWeekSuccess: number;
  weeklySuccessTone: WeeklySuccessTone;
  weeklyDelta: number;
  weeklyDeltaDirection: WeeklyDeltaDirection;
};
