import { Button } from '@repo/ui/button';
import type { ChangeEvent } from 'react';
import { useState } from 'react';

import { EmailField, PasswordField } from '../ui';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex flex-col gap-4 space-y-4">
      <EmailField
        id="email"
        name="email"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        required
      />

      <PasswordField
        id="password"
        name="password"
        value={password}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        required
      />

      <Button>로그인 하기</Button>
    </div>
  );
}
