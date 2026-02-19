import { cva, type VariantProps } from 'class-variance-authority';
import { Label as LabelPrimitive } from 'radix-ui';
import { type TextareaHTMLAttributes } from 'react';

import { cn } from './lib/utils';

const textareaControlVariants = cva(
  [
    'w-full',
    'bg-transparent',
    'transition-colors',
    'duration-(--transition-base)',
    'resize-none px-3 py-2',
    'outline-none',
    'disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        default: ['rounded-md', 'border'],
        borderless: ['border-0'],
      },
      error: {
        true: [
          'border-error-500',
          'focus-within:border-error-500',
          'focus-within:ring-2',
          'focus-within:ring-error-500',
          'focus-within:ring-offset-2',
        ],
        false: [],
      },
      disabled: {
        true: ['opacity-(--disabled-opacity)', 'cursor-not-allowed'],
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'borderless',
        error: true,
        class: ['border-0', 'focus-within:ring-0', 'focus-within:ring-offset-0'],
      },
      {
        variant: 'borderless',
        error: false,
        class: ['border-0', 'focus-within:ring-0', 'focus-within:ring-offset-0'],
      },
    ],
    defaultVariants: {
      variant: 'default',
      error: false,
      disabled: false,
    },
  },
);

const textareaHelperTextVariants = cva(['mt-1.5 text-sm'], {
  variants: {
    type: {
      default: 'text-(--color-fg-muted)',
      error: 'text-error-600',
    },
  },
  defaultVariants: {
    type: 'default',
  },
});

export interface TextareaLabelProps extends React.ComponentPropsWithoutRef<
  typeof LabelPrimitive.Root
> {}

export function TextareaLabel({ className, children, ...props }: TextareaLabelProps) {
  return (
    <LabelPrimitive.Root
      className={cn('mb-1.5 block text-sm font-medium text-(--color-fg)', className)}
      {...props}
    >
      {children}
    </LabelPrimitive.Root>
  );
}

export interface TextareaHelperTextProps
  extends
    React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textareaHelperTextVariants> {
  variant?: TextareaStyleVariant;
}

export function TextareaHelperText({
  className,
  type,
  variant = 'default',
  children,
  ...props
}: TextareaHelperTextProps) {
  const hasContent = children && children !== '\u00A0';

  //borderless 이면 render 하지 않음 (helpertext 사용 안함)
  if (variant === 'borderless' && !hasContent) {
    return null;
  }

  return (
    <p
      className={cn(
        textareaHelperTextVariants({ type }),
        variant === 'default' && 'min-h-5',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export type TextareaVariant = 'default' | 'with-count'; //작성길이/제한길이
export type TextareaStyleVariant = 'default' | 'borderless';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: TextareaVariant;
  styleVariant?: TextareaStyleVariant;
  error?: boolean;
  maxLength?: number;
}

export function Textarea({
  variant = 'default',
  styleVariant = 'default',
  error = false,
  disabled,
  maxLength,
  value,
  className,
  ...props
}: TextareaProps) {
  const currentLength = typeof value === 'string' ? value.length : 0;
  const showCount = variant === 'with-count';
  const isOverLimit = maxLength !== undefined && currentLength > maxLength;

  return (
    <>
      <textarea
        disabled={disabled}
        maxLength={maxLength}
        value={value}
        className={cn(
          textareaControlVariants({ variant: styleVariant, error, disabled: disabled ?? false }),
          className,
        )}
        {...props}
      />
      {showCount && (
        <div className="mt-1 flex justify-end">
          <span
            className={cn('text-xs', isOverLimit ? 'text-error-600' : 'text-(--color-fg-muted)')}
            aria-live="polite"
          >
            {currentLength}
            {maxLength !== undefined && `/${maxLength}`}
          </span>
        </div>
      )}
    </>
  );
}
