import { createContext, useContext, useState, type ReactNode } from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './lib/utils';

interface InputContextValue {
  error?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isFocused: boolean;
  setIsFocused: (focused: boolean) => void;
}

const InputContext = createContext<InputContextValue | undefined>(undefined);

function useInputContext() {
  const context = useContext(InputContext);
  if (!context) {
    throw new Error('Input components must be used within Input.Root');
  }
  return context;
}

/**
 * Input Control variants
 */
const inputControlVariants = cva(
  [
    'flex items-center gap-2',
    'w-full',
    'rounded-md',
    'border',
    'bg-[var(--color-surface)]',
    'transition-colors',
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
          'focus-within:ring-offset-2',
        ],
        false: [
          'border-[var(--color-border)]',
          'hover:border-[var(--color-border-strong)]',
          'focus-within:border-[var(--color-brand)]',
          'focus-within:ring-2',
          'focus-within:ring-[var(--color-focus-ring)]',
          'focus-within:ring-offset-2',
        ],
      },
      disabled: {
        true: ['opacity-[var(--disabled-opacity)]', 'cursor-not-allowed'],
        false: '',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-3 text-base',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      error: false,
      disabled: false,
      size: 'md',
    },
  },
);

/**
 * Input Field variants
 */
const inputFieldVariants = cva(
  [
    'flex-1',
    'bg-transparent',
    'text-[var(--color-fg)]',
    'placeholder:text-[var(--color-fg-subtle)]',
    'outline-none',
    'disabled:cursor-not-allowed',
  ],
  {
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

/**
 * Input Helper Text variants
 */
const inputHelperTextVariants = cva(['mt-1.5 text-sm'], {
  variants: {
    type: {
      default: 'text-[var(--color-fg-muted)]',
      error: 'text-error-600',
      success: 'text-success-600',
      warning: 'text-warning-600',
    },
  },
  defaultVariants: {
    type: 'default',
  },
});

/*Root Component*/

export interface InputRootProps {
  children: ReactNode;
  error?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

function InputRoot({ children, error, disabled, size = 'md' }: InputRootProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <InputContext.Provider value={{ error, disabled, size, isFocused, setIsFocused }}>
      <div className="w-full">{children}</div>
    </InputContext.Provider>
  );
}

/* Label Component*/

export interface InputLabelProps extends React.ComponentPropsWithoutRef<
  typeof LabelPrimitive.Root
> {}

function InputLabel({ className, children, ...props }: InputLabelProps) {
  const { size } = useInputContext();

  return (
    <LabelPrimitive.Root
      className={cn(
        'mb-1.5 block font-medium text-(--color-fg)',
        size === 'sm' && 'text-sm',
        size === 'md' && 'text-sm',
        size === 'lg' && 'text-base',
        className,
      )}
      {...props}
    >
      {children}
    </LabelPrimitive.Root>
  );
}

/* Control Component (Wrapper) */

export interface InputControlProps extends React.HTMLAttributes<HTMLDivElement> {}

function InputControl({ className, children, ...props }: InputControlProps) {
  const { error, disabled, size } = useInputContext();

  return (
    <div className={cn(inputControlVariants({ error, disabled, size, className }))} {...props}>
      {children}
    </div>
  );
}

/* actual input */

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {}

function InputField({ className, onFocus, onBlur, ...props }: InputFieldProps) {
  const { size, disabled, setIsFocused } = useInputContext();

  return (
    <input
      className={cn(inputFieldVariants({ size, className }))}
      disabled={disabled}
      onFocus={(e) => {
        setIsFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        onBlur?.(e);
      }}
      {...props}
    />
  );
}

/* Icon Components */

export interface InputIconProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function InputLeftIcon({ className, children, ...props }: InputIconProps) {
  const { size } = useInputContext();

  return (
    <div
      className={cn(
        'text-fg-subtle flex items-center',
        size === 'sm' && 'h-4 w-4',
        size === 'md' && 'h-5 w-5',
        size === 'lg' && 'h-6 w-6',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function InputRightIcon({ className, children, ...props }: InputIconProps) {
  const { size } = useInputContext();

  return (
    <div
      className={cn(
        'flex items-center text-(--color-fg-subtle)',
        size === 'sm' && 'h-4 w-4',
        size === 'md' && 'h-5 w-5',
        size === 'lg' && 'h-6 w-6',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* Helper Text Component */

export interface InputHelperTextProps
  extends
    React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof inputHelperTextVariants> {}

function InputHelperText({ className, type, children, ...props }: InputHelperTextProps) {
  return (
    <p className={cn(inputHelperTextVariants({ type, className }))} {...props}>
      {children}
    </p>
  );
}

/* Export Compound Component */
//TODO: export 분리 고려하기

export const Input = {
  Root: InputRoot,
  Label: InputLabel,
  Control: InputControl,
  Field: InputField,
  LeftIcon: InputLeftIcon,
  RightIcon: InputRightIcon,
  HelperText: InputHelperText,
};
