import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './lib/utils';

interface TimeInputContextValue {
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  isFocused: boolean;
  setIsFocused: (focused: boolean) => void;
  value?: string;
  setValue: (value: string | undefined) => void;
}

const TimeInputContext = createContext<TimeInputContextValue | undefined>(undefined);

function useTimeInputContext() {
  const context = useContext(TimeInputContext);
  if (!context) {
    throw new Error('TimeInput components must be used within TimeInput.Root');
  }
  return context;
}

const timeInputControlVariants = cva(
  [
    'flex items-center gap-2',
    'w-full',
    'h-9',
    'rounded-lg',
    'border',
    'bg-surface-elevated',
    'px-3',
    'shadow-sm',
    'transition-colors',
    'transition-shadow',
    'duration-[var(--transition-base)]',
  ],
  {
    variants: {
      error: {
        true: [
          'border-error-500',
          'focus-within:border-error-500',
          'focus-within:ring-2',
          'focus-within:ring-error-500',
          'focus-within:shadow-md',
        ],
        false: [
          'border-border',
          'hover:border-border-strong',
          'focus-within:border-brand',
          'focus-within:ring-2',
          'focus-within:ring-focus-ring',
          'focus-within:shadow-md',
        ],
      },
      disabled: {
        true: ['opacity-[var(--disabled-opacity)]', 'cursor-not-allowed', 'shadow-none'],
        false: '',
      },
    },
    defaultVariants: {
      error: false,
      disabled: false,
    },
  },
);

const timeInputFieldVariants = cva([
  'flex-1',
  'min-w-0',
  'h-9',
  'bg-transparent',
  'text-fg',
  'text-sm',
  'placeholder:text-fg-muted',
  'outline-none',
  'disabled:cursor-not-allowed',
]);

const timeInputHelperTextVariants = cva(['mt-1 text-xs'], {
  variants: {
    type: {
      default: 'text-fg-muted',
      error: 'text-error-600',
    },
  },
  defaultVariants: {
    type: 'default',
  },
});

export interface TimeInputRootProps {
  children: ReactNode;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
}

function TimeInputRoot({ children, error, disabled, required }: TimeInputRootProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState<string | undefined>(undefined);

  return (
    <TimeInputContext.Provider
      value={{ error, disabled, required, isFocused, setIsFocused, value, setValue }}
    >
      <div className="w-full">{children}</div>
    </TimeInputContext.Provider>
  );
}

export interface TimeInputLabelProps extends React.ComponentPropsWithoutRef<
  typeof LabelPrimitive.Root
> {}

function TimeInputLabel({ className, children, ...props }: TimeInputLabelProps) {
  const { required } = useTimeInputContext();

  return (
    <LabelPrimitive.Root
      className={cn('text-fg-muted mb-1.5 block text-xs font-semibold', className)}
      {...props}
    >
      {children}
      {required && <span className="text-error-500 ml-1">*</span>}
    </LabelPrimitive.Root>
  );
}

export interface TimeInputControlProps extends React.HTMLAttributes<HTMLDivElement> {}

function TimeInputControl({ className, children, ...props }: TimeInputControlProps) {
  const { error, disabled } = useTimeInputContext();

  return (
    <div className={cn(timeInputControlVariants({ error, disabled, className }))} {...props}>
      <div className="flex min-w-0 flex-1 items-center">{children}</div>
    </div>
  );
}

export interface TimeInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function TimeInputField({
  className,
  onFocus,
  onBlur,
  onChange,
  value,
  defaultValue,
  ...props
}: TimeInputFieldProps) {
  const { disabled, setIsFocused, setValue } = useTimeInputContext();
  const resolvedDefaultValue = value === undefined ? defaultValue : undefined;

  useEffect(() => {
    if (value !== undefined) {
      setValue(value || undefined);
      return;
    }
    if (defaultValue !== undefined) {
      setValue(String(defaultValue) || undefined);
    }
  }, [defaultValue, setValue, value]);

  return (
    <input
      type="time"
      className={cn(timeInputFieldVariants({ className }))}
      disabled={disabled}
      onFocus={(e) => {
        setIsFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        onBlur?.(e);
      }}
      onChange={(e) => {
        setValue(e.target.value || undefined);
        onChange?.(e);
      }}
      value={value}
      defaultValue={resolvedDefaultValue}
      {...props}
    />
  );
}

export interface TimeInputHelperTextProps
  extends
    React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof timeInputHelperTextVariants> {}
//TODO: 모든 helper text 컴포넌트 통일하기
function TimeInputHelperText({ className, type, children, ...props }: TimeInputHelperTextProps) {
  return (
    <p className={cn(timeInputHelperTextVariants({ type, className }))} {...props}>
      {children}
    </p>
  );
}

export const TimeInput = {
  Root: TimeInputRoot,
  Label: TimeInputLabel,
  Control: TimeInputControl,
  Field: TimeInputField,
  HelperText: TimeInputHelperText,
};
