import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { ROUTES } from '@/src/shared/routes';

export function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    void router.replace(ROUTES.MOMENTS);
  }, [router]);

  return (
    <div className="animate-splash-bg text-text-inverse flex min-h-dvh w-full items-center justify-center bg-linear-to-br px-6">
      <div className="animate-splash-fade flex flex-col items-center gap-6 text-center">
        <Image src="/icons/logo.svg" width={500} height={300} alt="Growing Developer" />
      </div>
    </div>
  );
}
