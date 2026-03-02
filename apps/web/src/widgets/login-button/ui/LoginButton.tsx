import { Button } from '@repo/ui/button';
import { useRouter } from 'next/router';

import { ROUTES } from '@/src/shared/routes';

export function LoginButton() {
  const router = useRouter();

  return (
    <Button size="md" onClick={() => void router.push(ROUTES.LOGIN)}>
      로그인
    </Button>
  );
}
