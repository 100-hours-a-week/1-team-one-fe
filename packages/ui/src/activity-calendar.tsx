import { Tooltip } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';

import { cn } from './lib/utils';

export type Activity = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

const calendarBlockVariants = cva('aspect-square rounded transition-colors', {
  variants: {
    level: {
      0: 'bg-neutral-100',
      1: 'bg-success-200',
      2: 'bg-success-400',
      3: 'bg-success-600',
      4: 'bg-success-700',
    },
  },
  defaultVariants: {
    level: 0,
  },
});

export interface ActivityCalendarProps extends VariantProps<typeof calendarBlockVariants> {
  data: Activity[];
  className?: string;
  renderTooltip?: (activity: Activity) => ReactNode;
}

const defaultTooltipContent = (activity: Activity) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium">{activity.date}</span>
    <span className="text-xs tabular-nums">{activity.count}</span>
  </div>
);

export function ActivityCalendar({ data, className, renderTooltip }: ActivityCalendarProps) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Tooltip.Provider delayDuration={150}>
      <div className={cn('flex h-full w-full gap-2', className)}>
        {data.map((activity) => (
          <Tooltip.Root key={activity.date}>
            <Tooltip.Trigger asChild>
              <button
                type="button"
                aria-label={`${activity.date} ${activity.count}`}
                className={cn(
                  calendarBlockVariants({ level: activity.level }),
                  'focus-visible:ring-focus-ring focus-visible:ring-offset-bg flex-1 border-0 p-0 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                )}
              />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                side="top"
                sideOffset={8}
                className={cn(
                  'z-50 rounded-md bg-black/60 px-3 py-2 text-white',
                  'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
                )}
              >
                {renderTooltip?.(activity) ?? defaultTooltipContent(activity)}
                <Tooltip.Arrow className="fill-black/60" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        ))}
      </div>
    </Tooltip.Provider>
  );
}

ActivityCalendar.displayName = 'ActivityCalendar';
