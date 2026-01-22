import { Button } from '@repo/ui/button';
import type { ChangeEvent } from 'react';
import { useState } from 'react';

import { EmailField, PasswordField } from '../../ui';

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  isPending?: boolean;
}

export function LoginForm({ onSubmit, isPending }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = () => {
    if (isPending) {
      return;
    }

    void onSubmit({ email, password });
  };

  return (
    <div className="flex flex-col gap-4 space-y-4">
      <EmailField id="email" name="email" value={email} onChange={handleEmailChange} required />

      <PasswordField
        id="password"
        name="password"
        value={password}
        onChange={handlePasswordChange}
        required
      />

      <Button disabled={isPending} onClick={handleSubmit}>
        로그인 하기
      </Button>
    </div>
  );
}
