import { Button } from '@repo/ui/button';
import { useRouter } from 'next/router';

import type { LoginFormValues } from '@/src/features/auth/login';
import { LoginForm, useLoginMutation } from '@/src/features/auth/login';
import { ROUTES } from '@/src/shared/routes';

export function LoginPage() {
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const handleSignUp = () => router.push(ROUTES.SIGNUP);
  const handleSubmit = async (values: LoginFormValues) => {
    await loginMutation.mutateAsync(values);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div>
        <h1 className="text-2xl font-bold">로그인</h1>
      </div>
      <LoginForm onSubmit={handleSubmit} isPending={loginMutation.isPending} />
      <Button variant="ghost" onClick={handleSignUp}>
        회원가입 하기
      </Button>
    </div>
  );
}
