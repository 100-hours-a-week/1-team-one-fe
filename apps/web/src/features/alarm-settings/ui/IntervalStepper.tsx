import { Button } from '@repo/ui/button';
import { Minus, Plus } from 'lucide-react';

interface IntervalStepperProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  label?: string;
  helperText?: string;
}

export function IntervalStepper({
  value,
  onChange,
  min,
  max,
  step,
  disabled,
  label,
  helperText,
}: IntervalStepperProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - step);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + step);
    }
  };

  return (
    <div className="w-full">
      {label && <label className="text-text mb-1.5 block text-sm font-medium">{label}</label>}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <div className="flex-1 text-center">
          <span className="text-text text-lg font-semibold">{value}분</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {helperText && <p className="text-fg-muted mt-1.5 text-sm">{helperText}</p>}
    </div>
  );
}
