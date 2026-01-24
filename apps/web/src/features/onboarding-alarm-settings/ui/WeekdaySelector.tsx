import { Chip } from '@repo/ui/chip';

import { WEEKDAY_OPTIONS } from '../config';
import type { Weekday } from '../lib';

interface WeekdaySelectorProps {
  value: Weekday[];
  onChange: (weekdays: Weekday[]) => void;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  helperText?: string;
}

export function WeekdaySelector({
  value,
  onChange,
  error,
  errorMessage,
  label,
  helperText,
}: WeekdaySelectorProps) {
  const handleToggle = (day: Weekday) => {
    const newWeekdays = value.includes(day) ? value.filter((d) => d !== day) : [...value, day];
    onChange(newWeekdays);
  };

  return (
    <div className="w-full">
      {label && <label className="text-text mb-1.5 block text-sm font-medium">{label}</label>}
      <div className="flex flex-wrap justify-center gap-2">
        {WEEKDAY_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            variant="selectable"
            label={option.label}
            selected={value.includes(option.value)}
            onClick={() => handleToggle(option.value)}
            size="md"
          />
        ))}
      </div>
      {error && errorMessage ? (
        <p className="text-error-600 mt-1.5 text-sm">{errorMessage}</p>
      ) : helperText ? (
        <p className="text-fg-muted mt-1.5 text-sm">{helperText}</p>
      ) : null}
    </div>
  );
}
