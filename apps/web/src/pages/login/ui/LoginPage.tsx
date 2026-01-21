import { Button } from '@repo/ui/button';
import { useRouter } from 'next/router';

import { LoginForm } from '@/src/features/auth/login/LoginForm';
import { ROUTES } from '@/src/shared/routes';

export function LoginPage() {
  const router = useRouter();
  const handleSignUp = () => router.push(ROUTES.SIGNUP);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div>
        <h1 className="text-2xl font-bold">로그인</h1>
      </div>
      <LoginForm />
      <Button variant="ghost" onClick={handleSignUp}>
        회원가입 하러가기
      </Button>
    </div>
  );
}
