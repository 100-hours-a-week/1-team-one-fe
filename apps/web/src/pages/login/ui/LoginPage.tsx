import { LoginForm } from '@/src/features/auth/login/LoginForm';

export function LoginPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div>
        <h1 className="text-2xl font-bold">로그인</h1>
      </div>
      <LoginForm />
    </div>
  );
}
