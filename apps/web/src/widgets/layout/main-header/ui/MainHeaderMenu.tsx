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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu';
import { Menu } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { DndBottomSheet } from '@/src/features/alarm-settings';
import { useLogoutMutation } from '@/src/features/auth/logout';
import { ROUTES } from '@/src/shared/routes/routes';

import { MAIN_HEADER_MESSAGES } from '../config/messages';

export function MainHeaderMenu() {
  const router = useRouter();
  const [isDndSheetOpen, setIsDndSheetOpen] = useState(false);
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
    <>
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
          <DropdownMenuItem
            className="flex flex-col items-start gap-1"
            onSelect={() => setIsDndSheetOpen(true)}
          >
            <span className="text-sm font-medium">{MAIN_HEADER_MESSAGES.MENU_DND_LABEL}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border my-1 h-px" />
          <DropdownMenuItem onSelect={() => setIsLogoutOpen(true)}>
            {MAIN_HEADER_MESSAGES.MENU_LOGOUT_LABEL}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuRoot>

      <DndBottomSheet open={isDndSheetOpen} onOpenChange={setIsDndSheetOpen} />

      <ConfirmDialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>{MAIN_HEADER_MESSAGES.LOGOUT_DIALOG_TITLE}</ConfirmDialogTitle>
          </ConfirmDialogHeader>
          <ConfirmDialogFooter>
            <ConfirmDialogClose asChild>
              <Button variant="secondary" size="sm">
                {MAIN_HEADER_MESSAGES.LOGOUT_CANCEL}
              </Button>
            </ConfirmDialogClose>
            <Button size="sm" onClick={handleLogoutConfirm} disabled={isLogoutPending}>
              {MAIN_HEADER_MESSAGES.LOGOUT_CONFIRM}
            </Button>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>
    </>
  );
}

MainHeaderMenu.displayName = 'MainHeaderMenu';
