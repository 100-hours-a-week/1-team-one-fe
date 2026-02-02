/**
 * 전역 로딩이 활성화되면 TopProgressBar를 표시 (포탈 기반)
 * _app.tsx에서 최상위에
 */
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { useGlobalLoadingState } from '@/src/shared/model/loading';

import { TopProgressBar } from './TopProgressBar';

export function GlobalLoadingOverlay() {
  const { isVisible } = useGlobalLoadingState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isVisible) {
    return null;
  }

  return createPortal(<TopProgressBar />, document.body);
}
