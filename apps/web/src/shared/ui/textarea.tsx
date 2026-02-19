import {
  Textarea,
  TextareaHelperText,
  TextareaLabel,
  type TextareaStyleVariant,
  type TextareaVariant,
} from '@repo/ui/textarea';
import { type ChangeEvent, type FocusEvent } from 'react';

export interface TextareaFieldProps {
  //label 설정
  label?: string;

  //textarea 본문
  id?: string;
  name?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;

  maxLength?: number;

  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;

  variant?: TextareaVariant;
  styleVariant?: TextareaStyleVariant;

  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
}

export function TextareaField({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  rows = 4,
  maxLength,
  disabled,
  error,
  errorMessage,
  helperText,
  variant = 'default',
  styleVariant = 'default',
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
}: TextareaFieldProps) {
  const helperId = id ? `${id}-helper` : undefined;

  const showErrorMessage = error && !!errorMessage;
  const showHelperText = !error && !!helperText;
  const isHelperEmpty = !showErrorMessage && !showHelperText;

  return (
    <div className="w-full">
      {label && <TextareaLabel htmlFor={id}>{label}</TextareaLabel>}

      <Textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        error={error}
        variant={variant}
        styleVariant={styleVariant}
        aria-describedby={ariaDescribedBy ?? helperId}
        aria-invalid={ariaInvalid ?? error}
      />

      <TextareaHelperText
        id={helperId}
        type={showErrorMessage ? 'error' : 'default'}
        variant={styleVariant}
        aria-hidden={isHelperEmpty}
      >
        {showErrorMessage ? errorMessage : showHelperText ? helperText : '\u00A0'}
      </TextareaHelperText>
    </div>
  );
}
