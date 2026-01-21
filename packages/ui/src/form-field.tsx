import { Input } from './input';
import type { ChangeEvent, FocusEvent, KeyboardEvent, ReactNode } from 'react';
import { cn } from './lib/utils';

type DupStatus = 'idle' | 'checking' | 'available' | 'unavailable' | 'error';

interface DuplicationCheckOption {
  enabled: boolean;
  status: DupStatus;
  message?: string;
  buttonText?: string;
  disabled?: boolean;

  onCheck: () => void;
}

export interface FormFieldProps {
  // 라벨
  label?: string;
  required?: boolean;

  // input
  id?: string;
  name?: string;
  type?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;

  // state
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;

  // size
  size?: 'sm' | 'md' | 'lg';

  // icon
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;

  // Accessibility
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;

  rightAddon?: ReactNode;
  duplicationCheck?: DuplicationCheckOption;
}

export function FormField({
  // Label props
  label,
  required,

  // Input props
  id,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  autoComplete,

  // State props
  disabled,
  error,
  errorMessage,
  helperText,

  // Size
  size = 'md',

  // Icons
  leftIcon,
  rightIcon,
  onRightIconClick,

  // Accessibility
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,

  rightAddon,
  duplicationCheck,
}: FormFieldProps) {
  const helperId = id ? `${id}-helper` : undefined;
  const dup = duplicationCheck;

  const showErrorMessage = error && errorMessage;
  const showHelperText = !error && !!helperText;
  const showDupMessage = !error && !!dup?.enabled && !!dup.message;

  return (
    <Input.Root error={error} disabled={disabled} size={size}>
      {label && (
        <Input.Label htmlFor={id}>
          {label}
          {required && <span aria-label="required"> *</span>}
        </Input.Label>
      )}

      <Input.Control>
        {leftIcon && <Input.LeftIcon>{leftIcon}</Input.LeftIcon>}

        <Input.Field
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={(e) => onBlur?.(e)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-describedby={ariaDescribedBy || helperId}
          aria-invalid={ariaInvalid ?? error}
        />

        {duplicationCheck?.enabled ? (
          <Input.RightAddon>
            <button
              type="button"
              disabled={
                disabled || duplicationCheck.disabled || duplicationCheck.status === 'checking'
              }
              onClick={duplicationCheck.onCheck}
              className={cn(
                'shrink-0 rounded-md px-2 py-1 text-sm font-medium',
                'border-border bg-surface border',
                'hover:bg-surface-muted',
                'disabled:cursor-not-allowed disabled:opacity-(--disabled-opacity)',
              )}
            >
              {duplicationCheck.status === 'checking'
                ? '확인중…'
                : (duplicationCheck.buttonText ?? '중복 확인')}
            </button>
          </Input.RightAddon>
        ) : rightAddon ? (
          <Input.RightAddon>{rightAddon}</Input.RightAddon>
        ) : rightIcon ? (
          <Input.RightIcon
            onClick={onRightIconClick}
            role={onRightIconClick ? 'button' : undefined}
            tabIndex={onRightIconClick ? 0 : undefined}
            onKeyDown={
              onRightIconClick
                ? (e: KeyboardEvent<HTMLDivElement>) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onRightIconClick();
                    }
                  }
                : undefined
            }
          >
            {rightIcon}
          </Input.RightIcon>
        ) : null}
      </Input.Control>

      {showErrorMessage && (
        <Input.HelperText id={helperId} type={'error'}>
          {errorMessage}
        </Input.HelperText>
      )}

      {!showErrorMessage && showDupMessage && (
        <Input.HelperText
          id={helperId}
          type={
            dup.status === 'available'
              ? 'success'
              : dup.status === 'unavailable'
                ? 'error'
                : dup.status === 'error'
                  ? 'warning'
                  : 'default'
          }
        >
          {dup.message}
        </Input.HelperText>
      )}

      {!showErrorMessage && !showDupMessage && showHelperText && (
        <Input.HelperText id={helperId} type="default">
          {helperText}
        </Input.HelperText>
      )}
    </Input.Root>
  );
}
