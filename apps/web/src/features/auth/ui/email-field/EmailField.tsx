import { FormField, type FormFieldProps } from '@repo/ui/form-field';
import { Mail } from 'lucide-react';

export type EmailFieldProps = Omit<FormFieldProps, 'type' | 'leftIcon'>;

export function EmailField({
  label = '이메일',
  placeholder = '이메일을 입력해주세요',
  autoComplete = 'email',
  ...props
}: EmailFieldProps) {
  return (
    <FormField
      label={label}
      placeholder={placeholder}
      type="email"
      autoComplete={autoComplete}
      leftIcon={<Mail />}
      {...props}
    />
  );
}
