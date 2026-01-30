import { cn } from '@repo/ui/lib/utils';
import { cva } from 'class-variance-authority';
import { Bell } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';

import { useUnreadNotificationsCountQuery } from '@/src/features/notifications';

import { MAIN_HEADER_MESSAGES } from '../config/messages';

const mainHeaderVariants = cva([
  'sticky top-0 z-10',
  'flex items-center justify-between',
  'w-full, h-16',
  'px-4 py-3',
  'sm:px-6',
  'bg-bg',
]);

export function MainHeader({ className, ...props }: React.ComponentPropsWithoutRef<'header'>) {
  const { data: unreadData } = useUnreadNotificationsCountQuery();
  const unreadCount = unreadData?.unreadCount ?? 0;

  return (
    <header className={cn(mainHeaderVariants(), className)} {...props}>
      <Link href="/app" className="shrink-0">
        <Image
          src="/icons/logo-without-bg.svg"
          alt={MAIN_HEADER_MESSAGES.LOGO_ALT}
          width={60}
          height={40}
          priority
        />
      </Link>

      <Link
        href="/app/settings/notifications"
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
    </header>
  );
}

MainHeader.displayName = 'MainHeader';
