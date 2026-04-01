import { MonthlyGrassStatsPanel } from '@/src/features/grass-stats';
import { StatsMonthSelector } from '@/src/features/stats-month-selector';
import { ReactionSpeedChallengePanel } from '@/src/features/stats-reaction-speed';
import { StatsSummarySection } from '@/src/features/stats-summary';

import { useStatsMonthQueryState } from '../model/useStatsMonthQueryState';

export function AppStatisticsPage() {
  const { selectedMonth, handleMonthChange } = useStatsMonthQueryState();

  return (
    <section className="flex flex-col gap-4 px-5 py-4">
      <StatsSummarySection />
      <StatsMonthSelector selectedMonth={selectedMonth} onMonthChange={handleMonthChange} />
      <MonthlyGrassStatsPanel selectedMonth={selectedMonth} />
      <ReactionSpeedChallengePanel />
    </section>
  );
}
