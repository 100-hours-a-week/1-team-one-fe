import { useEffect, useState } from 'react';

/**
 * 로딩 상태 표시를 지연해 플리커를 방지를 위함
 * @param value - 지연할 값
 * @param delayMs - true 전환을 지연할 시간
 * @returns 지연된 boolean
 */
export function useDelayedValue(value: boolean, delayMs: number): boolean {
  const [delayedValue, setDelayedValue] = useState(false);

  useEffect(() => {
    if (value) {
      //true 전환 지연
      const timerId = setTimeout(() => {
        setDelayedValue(true);
      }, delayMs);

      return () => {
        clearTimeout(timerId);
      };
    }

    //false 전환 시 숨김
    setDelayedValue(false);
    return undefined;
  }, [value, delayMs]);

  return delayedValue;
}
