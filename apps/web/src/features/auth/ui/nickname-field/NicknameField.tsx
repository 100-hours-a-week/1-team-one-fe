import { FormField, type FormFieldProps } from '@repo/ui/form-field';
import { UserCircle } from 'lucide-react';

import { FORM_MESSAGES } from '../../signup/config/form-messages';

export type NicknameFieldProps = Omit<FormFieldProps, 'type' | 'leftIcon'>;

export function NicknameField({
  label = FORM_MESSAGES.NICKNAME.LABEL,
  placeholder = FORM_MESSAGES.NICKNAME.PLACEHOLDER,
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
