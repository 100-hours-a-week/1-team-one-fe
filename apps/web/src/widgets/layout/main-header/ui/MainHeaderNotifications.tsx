import { Bell } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

import { useUnreadNotificationsCountQuery } from '@/src/features/notifications';
import { ROUTES } from '@/src/shared/routes';

import { MAIN_HEADER_MESSAGES } from '../config/messages';

export function MainHeaderNotifications() {
  const { data: unreadData } = useUnreadNotificationsCountQuery();
  const unreadCount = unreadData?.unreadCount ?? 0;

  return (
    <Link
      href={ROUTES.SETTINGS_NOTIFICATIONS}
      className="hover:bg-bg-subtle/60 inline-flex h-9 w-9 items-center justify-center rounded-full transition active:scale-[0.98]"
      aria-label={MAIN_HEADER_MESSAGES.NOTIFICATIONS_LABEL}
    >
      <span className="relative inline-flex">
        <Bell className="text-text h-5 w-5" />
        {unreadCount > 0 && (
          <span
            className="bg-error-500 absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-xs font-semibold text-white"
            aria-label={MAIN_HEADER_MESSAGES.NOTIFICATIONS_BADGE_ARIA.replace(
              '{count}',
              String(unreadCount),
            )}
          >
            {unreadCount}
          </span>
        )}
      </span>
    </Link>
  );
}

MainHeaderNotifications.displayName = 'MainHeaderNotifications';
