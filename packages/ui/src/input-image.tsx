import { useEffect, useId, useRef, useState } from 'react';
import type { FocusEvent } from 'react';

import { Avatar } from './avatar';
import { Button } from './button';
import { Input } from './input';
import { cn } from './lib/utils';
import { Spinner } from './spinner';

export interface InputImageProps {
  name?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  accept?: string;
  disabled?: boolean;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  value?: File | null;
  src?: string | null;
  alt?: string;
  fallbackText?: string;
  clearLabel?: string;
  clearAriaLabel?: string;
  onChange?: (file: File | null) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  className?: string;
}

export function InputImage({
  name,
  label,
  helperText,
  error,
  errorMessage,
  accept,
  disabled,
  isLoading,
  size = 'lg',
  value,
  src,
  alt,
  fallbackText,
  clearLabel,
  clearAriaLabel,
  onChange,
  onBlur,
  onClear,
  className,
}: InputImageProps) {
  const inputId = useId();
  const helperId = `${inputId}-helper`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(value);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [value]);

  const resolvedSrc = previewUrl ?? src ?? undefined;
  const showErrorMessage = error && errorMessage;
  const showHelperText = !showErrorMessage && !!helperText;
  const showClearButton = !!onClear && (!!value || !!src);

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onChange?.(null);
    onClear?.();
  };

  return (
    <Input.Root error={error} disabled={disabled} size={size}>
      {label && <Input.Label htmlFor={inputId}>{label}</Input.Label>}

      <div className={cn('mt-2 flex items-center justify-center gap-4', className)}>
        <div className="relative">
          <label
            htmlFor={inputId}
            className={cn(
              'inline-flex rounded-full transition',
              disabled ? 'cursor-not-allowed opacity-(--disabled-opacity)' : 'cursor-pointer',
            )}
          >
            <Avatar
              src={resolvedSrc}
              alt={alt ?? label}
              fallbackText={fallbackText}
              size={size}
              className={cn(
                'ring-border ring-2',
                !disabled && 'hover:ring-border-strong',
                error && 'ring-error-500',
              )}
            />
          </label>

          {isLoading && (
            <div className="bg-bg/40 absolute inset-0 flex items-center justify-center rounded-full">
              <Spinner size="sm" />
            </div>
          )}
        </div>

        <input
          id={inputId}
          name={name}
          type="file"
          accept={accept}
          disabled={disabled}
          className="sr-only"
          ref={inputRef}
          onChange={(event) => onChange?.(event.target.files?.[0] ?? null)}
          onBlur={onBlur}
          aria-describedby={helperId}
          aria-invalid={error}
        />

        {showClearButton && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            aria-label={clearAriaLabel ?? clearLabel}
            disabled={disabled}
          >
            {clearLabel}
          </Button>
        )}
      </div>

      {showErrorMessage && (
        <Input.HelperText id={helperId} type="error">
          {errorMessage}
        </Input.HelperText>
      )}

      {showHelperText && (
        <Input.HelperText id={helperId} type="default">
          {helperText}
        </Input.HelperText>
      )}
    </Input.Root>
  );
}

InputImage.displayName = 'InputImage';
