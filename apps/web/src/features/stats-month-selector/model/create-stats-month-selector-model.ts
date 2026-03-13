import {
  formatStatsMonthLabel,
  normalizeStatsMonth,
  shiftStatsMonth,
} from '@/src/shared/lib/date/stats-month';

interface CreateStatsMonthSelectorModelParams {
  selectedMonth: string;
  onMonthChange: (nextMonth: string) => void;
}

export function createStatsMonthSelectorModel({
  selectedMonth,
  onMonthChange,
}: CreateStatsMonthSelectorModelParams) {
  const normalizedMonth = normalizeStatsMonth(selectedMonth);
  const monthLabel = formatStatsMonthLabel(normalizedMonth);

  const handlePreviousMonth = () => {
    const nextMonth = shiftStatsMonth(normalizedMonth, -1);
    onMonthChange(nextMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = shiftStatsMonth(normalizedMonth, 1);
    onMonthChange(nextMonth);
  };

  return {
    normalizedMonth,
    monthLabel,
    handlePreviousMonth,
    handleNextMonth,
  } as const;
}
