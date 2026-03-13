import { Card } from '@repo/ui/card';
import { Chip } from '@repo/ui/chip';
import { cn } from '@repo/ui/lib/utils';
import { Tooltip } from '@repo/ui/tooltip';
import { Leaf } from 'lucide-react';

import { formatStatsMonthLabel } from '@/src/shared/lib/date/stats-month';

import { useGrassStatsQuery } from '../api/grass-stats-query';
import { MONTHLY_GRASS_MESSAGES } from '../config/monthly-grass-messages';
import { buildMonthlyGrassUICells } from '../lib/build-monthly-grass-ui-cells';
import type { MonthlyGrassCell } from '../model/monthly-grass.types';
import { useMonthlyGrassTooltip } from '../model/useMonthlyGrassTooltip';

interface MonthlyGrassStatsPanelProps {
  selectedMonth: string;
}

function getGrassCellClassName(level: MonthlyGrassCell['level']) {
  if (level === 0) return 'bg-bg-muted';
  if (level === 1) return 'bg-success-100';
  if (level === 2) return 'bg-success-200';
  if (level === 3) return 'bg-success-400';
  return 'bg-success-500';
}

function formatRatioLabel(cell: MonthlyGrassCell) {
  if (cell.targetCount === 0) {
    return MONTHLY_GRASS_MESSAGES.TOOLTIP.RATIO_EMPTY;
  }

  return `${Math.round(cell.ratio * 100)}%`;
}

function formatAriaLabel(cell: MonthlyGrassCell) {
  const ratioLabel = formatRatioLabel(cell);
  return `${cell.date} ${MONTHLY_GRASS_MESSAGES.TOOLTIP.COUNT_LABEL} ${cell.successCount}/${cell.targetCount} ${MONTHLY_GRASS_MESSAGES.TOOLTIP.RATIO_LABEL} ${ratioLabel}`;
}

export function MonthlyGrassStatsPanel({ selectedMonth }: MonthlyGrassStatsPanelProps) {
  const monthLabel = formatStatsMonthLabel(selectedMonth);
  const { data } = useGrassStatsQuery({
    view: 'MONTHLY',
    month: selectedMonth,
  });
  const cells = buildMonthlyGrassUICells(selectedMonth, data?.grass ?? []);
  const { panelRef, isTooltipOpen, handleTooltipOpenChange, handleCellClick, handleCellKeyDown } =
    useMonthlyGrassTooltip();

  return (
    <Card variant="elevated" padding="md" className="bg-surface shadow-none">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-text flex items-center gap-2 text-base font-semibold">
          <Leaf aria-hidden="true" className="text-success-600 size-4" />
          <span>{MONTHLY_GRASS_MESSAGES.TITLE}</span>
        </p>
        <Chip variant="date" size="sm" label={monthLabel} />
      </div>

      <Tooltip.Provider delayDuration={150}>
        <div ref={panelRef} className="grid grid-cols-7 gap-1.5">
          {cells.map((cell) => {
            const isOpen = isTooltipOpen(cell.date);
            const ratioLabel = formatRatioLabel(cell);

            return (
              <Tooltip.Root
                key={cell.date}
                open={isOpen}
                onOpenChange={(nextOpen) => handleTooltipOpenChange(cell.date, nextOpen)}
              >
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    aria-label={formatAriaLabel(cell)}
                    className={cn(
                      'focus-visible:ring-focus-ring focus-visible:ring-offset-bg aspect-square w-full rounded-sm border-0 p-0 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                      getGrassCellClassName(cell.level),
                      cell.level >= 3 ? 'shadow-[0_0_0_1px_rgba(255,255,255,0.15)_inset]' : '',
                    )}
                    onClick={() => handleCellClick(cell.date)}
                    onKeyDown={handleCellKeyDown}
                  />
                </Tooltip.Trigger>
                <Tooltip.Content className="w-max px-2.5 py-1.5 text-xs">
                  <p className="font-medium">{cell.date}</p>
                  <p>
                    {MONTHLY_GRASS_MESSAGES.TOOLTIP.COUNT_LABEL}: {cell.successCount}/
                    {cell.targetCount}
                  </p>
                  <p>
                    {MONTHLY_GRASS_MESSAGES.TOOLTIP.RATIO_LABEL}: {ratioLabel}
                  </p>
                  <Tooltip.Arrow />
                </Tooltip.Content>
              </Tooltip.Root>
            );
          })}
        </div>
      </Tooltip.Provider>

      <p className="text-text-muted mt-3 text-xs">{MONTHLY_GRASS_MESSAGES.DESCRIPTION}</p>
    </Card>
  );
}
