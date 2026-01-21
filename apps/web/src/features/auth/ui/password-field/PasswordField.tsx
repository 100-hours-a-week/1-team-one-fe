import { FormField, type FormFieldProps } from '@repo/ui/form-field';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';

export interface PasswordFieldProps extends Omit<
  FormFieldProps,
  'type' | 'leftIcon' | 'rightIcon' | 'onRightIconClick'
> {
  showPasswordByDefault?: boolean;
}

export function PasswordField({
  label = 'Password',
  placeholder = '비밀번호를 입력해주세요',
  autoComplete = 'current-password',
  showPasswordByDefault = false,
  ...props
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(showPasswordByDefault);

  return (
    <FormField
      label={label}
      placeholder={placeholder}
      type={showPassword ? 'text' : 'password'}
      autoComplete={autoComplete}
      leftIcon={<Lock />}
      rightIcon={showPassword ? <EyeOff /> : <Eye />}
      onRightIconClick={() => setShowPassword((prev) => !prev)}
      {...props}
    />
  );
}
