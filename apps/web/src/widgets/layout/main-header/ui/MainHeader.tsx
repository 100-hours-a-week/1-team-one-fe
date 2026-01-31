import { Button } from '@repo/ui/button';
import {
  ConfirmDialog,
  ConfirmDialogClose,
  ConfirmDialogContent,
  ConfirmDialogFooter,
  ConfirmDialogHeader,
  ConfirmDialogTitle,
} from '@repo/ui/confirm-dialog';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu';
import { cn } from '@repo/ui/lib/utils';
import { cva } from 'class-variance-authority';
import { Bell, Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type React from 'react';
import { useState } from 'react';

import { useLogoutMutation } from '@/src/features/auth/logout';
import { useUnreadNotificationsCountQuery } from '@/src/features/notifications';
import { ROUTES } from '@/src/shared/routes/routes';

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
  const router = useRouter();
  const { data: unreadData } = useUnreadNotificationsCountQuery();
  const unreadCount = unreadData?.unreadCount ?? 0;
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const { mutateAsync: logoutAsync, isPending: isLogoutPending } = useLogoutMutation();

  const handleLogoutConfirm = async () => {
    if (isLogoutPending) return;

    try {
      await logoutAsync();
      setIsLogoutOpen(false);
      void router.replace(ROUTES.LOGIN);
    } catch (error) {
      console.warn('[logout] failed', { error });
    }
  };

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

      <div className="flex items-center gap-2">
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

        <DropdownMenuRoot>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="hover:bg-bg-subtle/60 inline-flex h-9 w-9 items-center justify-center rounded-full transition active:scale-[0.98]"
              aria-label={MAIN_HEADER_MESSAGES.MENU_LABEL}
            >
              <span className="relative inline-flex">
                <Menu className="text-text h-5 w-5" />
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setIsLogoutOpen(true)}>
              {MAIN_HEADER_MESSAGES.MENU_LOGOUT_LABEL}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuRoot>
      </div>

      <ConfirmDialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>{MAIN_HEADER_MESSAGES.LOGOUT_DIALOG_TITLE}</ConfirmDialogTitle>
          </ConfirmDialogHeader>
          <ConfirmDialogFooter>
            <ConfirmDialogClose asChild>
              <Button variant="secondary" size="sm" fullWidth>
                {MAIN_HEADER_MESSAGES.LOGOUT_CANCEL}
              </Button>
            </ConfirmDialogClose>
            <Button size="sm" onClick={handleLogoutConfirm} disabled={isLogoutPending} fullWidth>
              {MAIN_HEADER_MESSAGES.LOGOUT_CONFIRM}
            </Button>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>
    </header>
  );
}

MainHeader.displayName = 'MainHeader';
