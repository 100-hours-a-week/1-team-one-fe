import { useQueryClient } from '@tanstack/react-query';
import { ChevronUp } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';

import {
  NotificationList,
  useNotificationsInfiniteQuery,
  useNotificationsReadMutation,
} from '@/src/features/notifications';
import { NOTIFICATIONS_CONFIG } from '@/src/features/notifications/config/constants';
import { NOTIFICATIONS_MESSAGES } from '@/src/features/notifications/config/messages';
import { NOTIFICATIONS_QUERY_KEYS } from '@/src/features/notifications/config/query-keys';

export function AppSettingsNotificationsPage() {
  const queryClient = useQueryClient();
  const hasMarkedReadRef = useRef(false);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useNotificationsInfiniteQuery(NOTIFICATIONS_CONFIG.PAGE_LIMIT);

  const notifications = useMemo(
    () => data?.pages?.flatMap((page) => page.notifications) ?? [],
    [data],
  );

  const { mutate } = useNotificationsReadMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.unreadCount() });
    },
  });

  useEffect(() => {
    if (!data?.pages?.length) return;
    if (hasMarkedReadRef.current) return;

    const firstPage = data.pages[0];
    const latest = firstPage?.notifications[0];
    if (!latest) return;

    mutate({ lastNotificationTime: latest.createdAt });
    hasMarkedReadRef.current = true;
  }, [data?.pages, mutate]);

  useEffect(() => {
    console.log(fetchNextPage, hasNextPage);
  }, [fetchNextPage, hasNextPage]);

  const handleScrollTop = () => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-6">
        <NotificationList
          items={notifications}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={Boolean(hasNextPage)}
          onFetchNext={() => void fetchNextPage()}
        />
      </div>
      <button
        type="button"
        aria-label={NOTIFICATIONS_MESSAGES.ACTIONS.SCROLL_TOP}
        onClick={handleScrollTop}
        className="bg-brand-600 text-on-brand fixed right-4 bottom-6 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition active:scale-95"
      >
        <ChevronUp className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
