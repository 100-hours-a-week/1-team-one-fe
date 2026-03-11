import { type NextRouter, useRouter } from 'next/router';
import { useEffect } from 'react';

import { normalizeStatsMonth } from '@/src/features/stats-month-selector';

import { STATS_MONTH_QUERY_KEY } from '../config/constants';

const MONTH_QUERY_NAVIGATION_OPTIONS = {
  shallow: true,
  scroll: false,
} as const;

function getMonthQueryValue(value: string | string[] | undefined): string | undefined {
  if (typeof value === 'string') {
    return value;
  }

  return undefined;
}

function createMonthQueryRoute(router: NextRouter, month: string) {
  return {
    pathname: router.pathname,
    query: {
      ...router.query,
      [STATS_MONTH_QUERY_KEY]: month,
    },
  };
}

function replaceToMonthQueryString(router: NextRouter, month: string) {
  return router.replace(
    createMonthQueryRoute(router, month),
    undefined,
    MONTH_QUERY_NAVIGATION_OPTIONS,
  );
}

function pushToMonthQueryString(router: NextRouter, month: string) {
  return router.push(
    createMonthQueryRoute(router, month),
    undefined,
    MONTH_QUERY_NAVIGATION_OPTIONS,
  );
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

    void replaceToMonthQueryString(router, selectedMonth);
  }, [router, router.isReady, router.pathname, router.query, selectedMonth]);

  const handleMonthChange = (nextMonth: string) => {
    const normalizedNextMonth = normalizeStatsMonth(nextMonth);
    if (normalizedNextMonth === selectedMonth) return;

    void pushToMonthQueryString(router, normalizedNextMonth);
  };

  return {
    selectedMonth,
    isReady: router.isReady,
    handleMonthChange,
  } as const;
}
