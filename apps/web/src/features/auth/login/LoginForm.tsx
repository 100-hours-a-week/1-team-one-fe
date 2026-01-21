import type { ChangeEvent } from 'react';
import { useState } from 'react';

import { EmailField, PasswordField } from '../ui';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form className="space-y-4">
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

      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Sign in
      </button>
    </form>
  );
}
