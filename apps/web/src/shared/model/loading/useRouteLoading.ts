/**
 * 라우터 이벤트를 전역 로딩 컨트롤러와 연결 -> 상단 프로그레스바 보여줌
 * _app.tsx에서 호출
 */
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { GlobalLoadingController } from './global-loading-controller';

const ROUTE_LOADING_KEY = 'route-transition';

export function useRouteLoading(): void {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => {
      GlobalLoadingController.start(ROUTE_LOADING_KEY);
    };

    const handleRouteChangeComplete = () => {
      GlobalLoadingController.end(ROUTE_LOADING_KEY);
    };

    const handleRouteChangeError = () => {
      GlobalLoadingController.end(ROUTE_LOADING_KEY);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router]);
}
