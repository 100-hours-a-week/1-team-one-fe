import z from 'zod';

import { SignupForm } from '@/src/features/auth/signup';
import { signup } from '@/src/features/auth/signup/api';
import { signupSchema } from '@/src/features/auth/signup/model/signup-schema';

type SignupValues = z.infer<typeof signupSchema>;

export function SignupPage() {
  const handleSubmit = async (values: SignupValues) => {
    await signup({
      email: values.email,
      nickname: values.nickname,
      password: values.password,
    });
  };

  return <SignupForm onSubmit={handleSubmit} />;
}
