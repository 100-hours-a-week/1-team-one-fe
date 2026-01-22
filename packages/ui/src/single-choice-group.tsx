import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cva } from 'class-variance-authority';
import { cn } from './lib/utils';

const radioItemVariants = cva([
  'relative',
  'flex items-center gap-3',
  'rounded-[var(--radius-md)]',
  'border',
  'px-4 py-3',
  'cursor-pointer',
  'transition',
  'duration-[var(--duration-base)]',
  'border-none',

  // 기본
  'data-[state=unchecked]:bg-surface',
  'data-[state=unchecked]:shadow-none',
  'data-[state=unchecked]:hover:bg-bg-subtle/60',

  //선택
  'data-[state=checked]:bg-brand-50/50',
  'data-[state=checked]:shadow-[0_0_0_rgba(0,0,0,0.06)]',

  'focus-visible:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-focus-ring/30',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-bg',

  'disabled:cursor-not-allowed',
  'disabled:opacity-[var(--disabled-opacity)]',
]);

const radioIndicatorVariants = cva([
  'flex items-center justify-center',
  'h-5 w-5',
  'rounded-full',
  'border',
  'transition',
  'duration-[var(--duration-base)]',
  'border-border-strong/60',
  'bg-surface',
]);

export interface SingleChoiceOption {
  label: string;
  value: string;
  description?: string;
}

export interface SingleChoiceGroupProps {
  ref?: React.Ref<HTMLDivElement>;
  options: SingleChoiceOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
  errorMessage?: string;
  orientation?: 'vertical' | 'horizontal';
  name?: string;
  disabled?: boolean;
  required?: boolean;
}

export function SingleChoiceGroup({
  ref,
  options,
  value,
  onChange,
  error = false,
  errorMessage,
  orientation = 'vertical',
  name,
  disabled = false,
  required = false,
}: SingleChoiceGroupProps) {
  return (
    <div ref={ref} className="w-full">
      <RadioGroupPrimitive.Root
        value={value}
        onValueChange={onChange}
        orientation={orientation}
        name={name}
        disabled={disabled}
        required={required}
        className={cn('flex gap-3', orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap')}
      >
        {options.map((option) => (
          <RadioGroupPrimitive.Item
            key={option.value}
            value={option.value}
            className={cn(radioItemVariants(), 'group')}
          >
            {/* 카드 전체 */}
            <span className="absolute inset-0" aria-hidden="true" />

            {/* 점 */}
            <div className={cn(radioIndicatorVariants())}>
              <div className="bg-brand h-2 w-2 rounded-full opacity-0 transition-opacity group-data-[state=checked]:opacity-100" />
            </div>

            <div className="flex-1 text-left">
              <div className="text-text text-sm font-medium">{option.label}</div>
              {option.description && (
                <div className="text-text-muted mt-0.5 text-xs">{option.description}</div>
              )}
            </div>

            <RadioGroupPrimitive.Indicator className="sr-only" />
          </RadioGroupPrimitive.Item>
        ))}
      </RadioGroupPrimitive.Root>

      {error && errorMessage && (
        <p className="text-error-600 mt-2 text-sm" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

SingleChoiceGroup.displayName = 'SingleChoiceGroup';
