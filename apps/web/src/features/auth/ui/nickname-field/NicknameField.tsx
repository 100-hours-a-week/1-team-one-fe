import { FormField, type FormFieldProps } from '@repo/ui/form-field';
import { UserCircle } from 'lucide-react';

export type NicknameFieldProps = Omit<FormFieldProps, 'type' | 'leftIcon'>;

export function NicknameField({
  label = '닉네임',
  placeholder = '닉네임을 입력해주세요',
  autoComplete = 'username',
  ...props
}: NicknameFieldProps) {
  return (
    <FormField
      label={label}
      placeholder={placeholder}
      type="text"
      autoComplete={autoComplete}
      leftIcon={<UserCircle />}
      {...props}
    />
  );
}
