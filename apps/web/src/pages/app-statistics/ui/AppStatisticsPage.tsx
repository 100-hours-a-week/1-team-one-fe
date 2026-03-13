import { MonthlyGrassStatsPanel } from '@/src/features/grass-stats';
import { StatsMonthSelector } from '@/src/features/stats-month-selector';

import { useStatsMonthQueryState } from '../model/useStatsMonthQueryState';

export function AppStatisticsPage() {
  const { selectedMonth, handleMonthChange } = useStatsMonthQueryState();

  return (
    <section className="flex flex-col gap-4 px-5 py-4">
      <StatsMonthSelector selectedMonth={selectedMonth} onMonthChange={handleMonthChange} />
      <MonthlyGrassStatsPanel selectedMonth={selectedMonth} />
    </section>
  );
}
