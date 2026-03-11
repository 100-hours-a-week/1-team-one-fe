import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { normalizeStatsMonth } from '@/src/features/stats-month-selector';

import { STATS_MONTH_QUERY_KEY } from '../config/constants';

function getMonthQueryValue(value: string | string[] | undefined): string | undefined {
  if (typeof value === 'string') {
    return value;
  }

  return undefined;
}

export function useStatsMonthQueryState() {
  const router = useRouter();
  const selectedMonth = normalizeStatsMonth(
    getMonthQueryValue(router.query[STATS_MONTH_QUERY_KEY]),
  );

  useEffect(() => {
    if (!router.isReady) return;

    const currentQueryValue = getMonthQueryValue(router.query[STATS_MONTH_QUERY_KEY]);
    if (currentQueryValue === selectedMonth) return;

    void router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          [STATS_MONTH_QUERY_KEY]: selectedMonth,
        },
      },
      undefined,
      { shallow: true, scroll: false },
    );
  }, [router, router.isReady, router.pathname, router.query, selectedMonth]);

  const handleMonthChange = (nextMonth: string) => {
    const normalizedNextMonth = normalizeStatsMonth(nextMonth);
    if (normalizedNextMonth === selectedMonth) return;

    void router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          [STATS_MONTH_QUERY_KEY]: normalizedNextMonth,
        },
      },
      undefined,
      { shallow: true, scroll: false },
    );
  };

  return {
    selectedMonth,
    isReady: router.isReady,
    handleMonthChange,
  } as const;
}
