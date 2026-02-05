import { Button } from '@repo/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import type { LoginFormValues } from '@/src/features/auth/login';
import { LoginForm, useLoginMutation } from '@/src/features/auth/login';
import { ONBOARDING_STATUS_QUERY_KEYS } from '@/src/features/onboarding-status/config/query-keys';
import { refreshPushTokenOnLogin, usePutFcmTokenMutation } from '@/src/features/push-notifications';
import { ROUTES } from '@/src/shared/routes';

export function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useLoginMutation();
  const { mutateAsync: putFcmToken } = usePutFcmTokenMutation();
  const handleSignUp = () => router.push(ROUTES.SIGNUP);

  const handleSubmit = async (values: LoginFormValues) => {
    await mutateAsync(values, {
      onSuccess: async () => {
        try {
          await refreshPushTokenOnLogin(putFcmToken);
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('[push-notifications] refresh_on_login_failed', { error });
          }
        }
        await queryClient.refetchQueries({
          queryKey: ONBOARDING_STATUS_QUERY_KEYS.onboardingStatus(),
          type: 'all',
        });
        router.push(ROUTES.POST_LOGIN);
      },
    });
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div>
        <h1 className="text-2xl font-bold">로그인</h1>
      </div>
      <LoginForm onSubmit={handleSubmit} isPending={isPending} />
      <Button variant="ghost" onClick={handleSignUp}>
        회원가입 하기
      </Button>
    </div>
  );
}
