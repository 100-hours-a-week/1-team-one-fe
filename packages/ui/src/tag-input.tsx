import { type KeyboardEvent, type Ref } from 'react';
import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from './lib/utils';

const tagInputControlVariants = cva(
  ['flex flex-wrap items-center gap-1.5', 'w-full', 'min-h-10 px-3 py-2', 'transition-colors'],
  {
    variants: {
      variant: {
        default: ['rounded-md', 'bg-surface', 'border'],
        borderless: ['bg-transparent', 'border-0'],
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

export interface TagChipProps {
  label: string;
  onRemove?: () => void;
  disabled?: boolean;
}

// #tag
export function TagChip({ label, onRemove, disabled }: TagChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1',
        'rounded-sm px-2.5 py-0.5',
        'bg-neutral-100',
        'text-sm font-medium',
        'whitespace-nowrap',
      )}
    >
      #{label}
      {/* 삭제버튼 */}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          aria-label="태그 삭제"
          className={cn(
            'cursor ml-0.5 flex h-4 w-4 items-center justify-center rounded-md',
            'text-brand-600',
            'hover:bg-neutral-50',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors',
          )}
        >
          <X size={10} aria-hidden="true" />
        </button>
      )}
    </span>
  );
}

export interface TagInputProps {
  tags: ReadonlyArray<string>;
  inputValue: string;
  onInputChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onTagRemove: (index: number) => void;
  maxTags?: number;
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
  variant?: 'default' | 'borderless';
  inputRef?: Ref<HTMLInputElement>;
}

export function TagInput({
  tags,
  inputValue,
  onInputChange,
  onKeyDown,
  onTagRemove,
  maxTags = 5,
  disabled,
  placeholder,
  error,
  variant = 'default',
  inputRef,
}: TagInputProps) {
  const isMaxReached = tags.length >= maxTags;

  return (
    <div
      className={tagInputControlVariants({
        variant,
        error: error ?? false,
        disabled: disabled ?? false,
      })}
    >
      {tags.map((tag, index) => (
        <TagChip
          key={`${tag}-${index}`}
          label={tag}
          onRemove={disabled ? undefined : () => onTagRemove(index)}
          disabled={disabled}
        />
      ))}

      {!isMaxReached && (
        <div className="flex min-w-0 flex-1 items-center gap-0.5">
          <span className="text-fg-subtle text-base select-none" aria-hidden="true">
            #
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            className={cn(
              'min-w-0 flex-1 bg-transparent',
              'text-fg text-base',
              'placeholder:text-fg-subtle',
              'outline-none',
              'disabled:cursor-not-allowed',
            )}
          />
        </div>
      )}
    </div>
  );
}
