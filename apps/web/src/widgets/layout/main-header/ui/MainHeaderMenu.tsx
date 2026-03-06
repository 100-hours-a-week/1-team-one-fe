import { Button } from '@repo/ui/button';
import {
  ConfirmDialog,
  ConfirmDialogClose,
  ConfirmDialogContent,
  ConfirmDialogFooter,
  ConfirmDialogHeader,
  ConfirmDialogTitle,
} from '@repo/ui/confirm-dialog';
import { DropdownMenuItem, DropdownMenuSeparator } from '@repo/ui/dropdown-menu';
import { useQueryClient } from '@tanstack/react-query';
import { Menu } from 'lucide-react';
import { useRouter } from 'next/router';
import { type ReactNode, useState } from 'react';

import { useLogoutMutation } from '@/src/features/auth/logout';
import { ROUTES } from '@/src/shared/routes/routes';
import { IconDropdownMenu } from '@/src/shared/ui/icon-dropdown-menu';
import { DndBottomSheet } from '@/src/widgets/dnd-bottom-sheet';

import { MAIN_HEADER_MESSAGES } from '../config/messages';

type MainHeaderMenuItem =
  | {
      key: string;
      type: 'action';
      content: ReactNode;
      onSelect: () => void;
      className?: string;
    }
  | {
      key: string;
      type: 'separator';
    };

export function MainHeaderMenu() {
  const router = useRouter();
  const [isDndSheetOpen, setIsDndSheetOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: logout, isPending: isLogoutPending } = useLogoutMutation({
    onSuccess: () => {
      //TODO: public 데이터는 캐시 초기화 x
      queryClient.clear(); //로그아웃 시 캐시 초기화
    },
  });

  const handleLogoutConfirm = () => {
    if (isLogoutPending) return;

    logout(undefined, {
      onSuccess: () => {
        setIsLogoutOpen(false);
        void router.replace(ROUTES.LOGIN);
      },
      onError: (error) => {
        console.warn('[logout] failed', { error });
      },
    });
  };

  const menuItems: MainHeaderMenuItem[] = [
    {
      key: 'dnd',
      type: 'action',
      className: 'flex flex-col items-start gap-1',
      content: <span className="text-sm font-medium">{MAIN_HEADER_MESSAGES.MENU_DND_LABEL}</span>,
      onSelect: () => setIsDndSheetOpen(true),
    },
    {
      key: 'separator',
      type: 'separator',
    },
    {
      key: 'logout',
      type: 'action',
      content: MAIN_HEADER_MESSAGES.MENU_LOGOUT_LABEL,
      onSelect: () => setIsLogoutOpen(true),
    },
  ];

  return (
    <>
      <IconDropdownMenu
        ariaLabel={MAIN_HEADER_MESSAGES.MENU_LABEL}
        icon={
          <span className="relative inline-flex">
            <Menu className="text-text h-5 w-5" />
          </span>
        }
      >
        {menuItems.map((item) => {
          if (item.type === 'separator') {
            return <DropdownMenuSeparator key={item.key} className="bg-border my-1 h-px" />;
          }

          return (
            <DropdownMenuItem key={item.key} className={item.className} onSelect={item.onSelect}>
              {item.content}
            </DropdownMenuItem>
          );
        })}
      </IconDropdownMenu>

      <DndBottomSheet open={isDndSheetOpen} onOpenChange={setIsDndSheetOpen} />

      <ConfirmDialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>{MAIN_HEADER_MESSAGES.LOGOUT_DIALOG_TITLE}</ConfirmDialogTitle>
          </ConfirmDialogHeader>
          <ConfirmDialogFooter>
            <ConfirmDialogClose asChild>
              <Button variant="secondary" size="sm" className="flex-1">
                {MAIN_HEADER_MESSAGES.LOGOUT_CANCEL}
              </Button>
            </ConfirmDialogClose>
            <Button
              size="sm"
              onClick={handleLogoutConfirm}
              isLoading={isLogoutPending}
              className="flex-1"
            >
              {MAIN_HEADER_MESSAGES.LOGOUT_CONFIRM}
            </Button>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>
    </>
  );
}

MainHeaderMenu.displayName = 'MainHeaderMenu';
