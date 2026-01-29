import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from './lib/utils';

export type Activity = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

const calendarBlockVariants = cva('aspect-square rounded transition-colors', {
  variants: {
    level: {
      0: 'bg-neutral-100 dark:bg-neutral-800',
      1: 'bg-success-200 dark:bg-success-800',
      2: 'bg-success-400 dark:bg-success-600',
      3: 'bg-success-600 dark:bg-success-400',
      4: 'bg-success-700 dark:bg-success-300',
    },
  },
  defaultVariants: {
    level: 0,
  },
});

export interface ActivityCalendarProps extends VariantProps<typeof calendarBlockVariants> {
  data: Activity[];
  className?: string;
}

export function ActivityCalendar({ data, className }: ActivityCalendarProps) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex h-full w-full gap-2', className)}>
      {data.map((activity) => (
        <div
          key={activity.date}
          className={cn(calendarBlockVariants({ level: activity.level }), 'flex-1')}
          title={`${activity.date}: ${activity.count}회 완료`}
        />
      ))}
    </div>
  );
}

ActivityCalendar.displayName = 'ActivityCalendar';
