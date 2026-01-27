import { useRouter } from 'next/router';
import z from 'zod';

import { SignupForm } from '@/src/features/auth/signup';
import { useSignupMutation } from '@/src/features/auth/signup/api';
import { signupSchema } from '@/src/features/auth/signup/model/signup-schema';
import { ROUTES } from '@/src/shared/routes';

type SignupValues = z.infer<typeof signupSchema>;

export function SignupPage() {
  const router = useRouter();
  const signupMutation = useSignupMutation();

  const handleSubmit = async (values: SignupValues) => {
    await signupMutation.mutateAsync(
      {
        email: values.email,
        nickname: values.nickname,
        password: values.password,
        imagePath: 'https://placehold.co/600x400',
      },
      { onSuccess: () => router.push(ROUTES.LOGIN) },
    );
  };

  return <SignupForm onSubmit={handleSubmit} isPending={signupMutation.isPending} />;
}
