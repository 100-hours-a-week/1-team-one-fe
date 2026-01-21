import { Input } from './input';
import type { ChangeEvent, FocusEvent, KeyboardEvent, ReactNode } from 'react';

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
}: FormFieldProps) {
  const helperId = id ? `${id}-helper` : undefined;

  const showErrorMessage = error && errorMessage;
  const showHelperText = !error && !!helperText;

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
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-describedby={ariaDescribedBy || helperId}
          aria-invalid={ariaInvalid ?? error}
        />

        {rightIcon && (
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
        )}
      </Input.Control>
      {showErrorMessage && (
        <Input.HelperText id={helperId} type={'error'}>
          {errorMessage}
        </Input.HelperText>
      )}

      {showHelperText && (
        <Input.HelperText id={helperId} type={'default'}>
          {helperText}
        </Input.HelperText>
      )}
    </Input.Root>
  );
}
