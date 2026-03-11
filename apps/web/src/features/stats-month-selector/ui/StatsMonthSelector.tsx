import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { STATS_MONTH_SELECTOR_MESSAGES } from '../config/messages';
import { createStatsMonthSelectorModel } from '../model/create-stats-month-selector-model';

interface StatsMonthSelectorProps {
  selectedMonth: string;
  onMonthChange: (nextMonth: string) => void;
}

export function StatsMonthSelector({ selectedMonth, onMonthChange }: StatsMonthSelectorProps) {
  const { monthLabel, handlePreviousMonth, handleNextMonth } = createStatsMonthSelectorModel({
    selectedMonth,
    onMonthChange,
  });

  return (
    <Card variant="elevated" padding="md" className="bg-bg-subtle shadow-none">
      <div className="flex items-center justify-between gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handlePreviousMonth}
          aria-label={STATS_MONTH_SELECTOR_MESSAGES.PREVIOUS_MONTH_ARIA_LABEL}
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </Button>

        <p className="text-text text-base font-semibold">{monthLabel}</p>

        <Button
          size="sm"
          variant="outline"
          onClick={handleNextMonth}
          aria-label={STATS_MONTH_SELECTOR_MESSAGES.NEXT_MONTH_ARIA_LABEL}
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </Card>
  );
}
