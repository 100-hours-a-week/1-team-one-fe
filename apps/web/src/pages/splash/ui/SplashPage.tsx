import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { ROUTES } from '@/src/shared/routes';

export function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    void router.replace(ROUTES.MOMENTS);
  }, [router]);

  return (
    <div className="animate-splash-bg from-brand-100 via-brand-200 to-brand-500 text-text-inverse flex min-h-dvh w-full items-center justify-center bg-linear-to-br px-6">
      <div className="animate-splash-fade flex flex-col items-center gap-6 text-center">
        <img src={'/icons/logo-with-bg.svg'} alt="Growing Developer" className="h-80 w-auto" />
      </div>
    </div>
  );
}
