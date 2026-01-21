import { SignupForm } from '@/src/features/auth/signup';
import { signup } from '@/src/features/auth/signup/api';

export function SignupPage() {
  const handleSubmit = async (values) => {
    await signup({
      email: values.email,
      nickname: values.nickname,
      password: values.password,
    });
  };

  return <SignupForm onSubmit={handleSubmit} />;
}
