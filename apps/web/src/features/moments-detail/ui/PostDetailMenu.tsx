import { Button } from '@repo/ui/button';
import {
  ConfirmDialog,
  ConfirmDialogClose,
  ConfirmDialogContent,
  ConfirmDialogDescription,
  ConfirmDialogFooter,
  ConfirmDialogHeader,
  ConfirmDialogTitle,
} from '@repo/ui/confirm-dialog';
import { DropdownMenuItem, DropdownMenuSeparator } from '@repo/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';

import { IconDropdownMenu } from '@/src/shared/ui/icon-dropdown-menu';

import { MOMENTS_DETAIL_MESSAGES } from '../config/messages';

type PostDetailMenuItem =
  | {
      key: string;
      type: 'action';
      label: string;
      onSelect: () => void;
    }
  | {
      key: string;
      type: 'separator';
    };

export interface PostDetailMenuProps {
  onEdit: () => void;
  onDelete: () => Promise<void>;
  isDeleting?: boolean;
}

export function PostDetailMenu({ onEdit, onDelete, isDeleting = false }: PostDetailMenuProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteConfirm = () => {
    if (isDeleting) return;
    void onDelete();
    setIsDeleteDialogOpen(false);
  };

  const menuItems: PostDetailMenuItem[] = [
    {
      key: 'edit',
      type: 'action',
      label: MOMENTS_DETAIL_MESSAGES.MENU.EDIT,
      onSelect: onEdit,
    },
    {
      key: 'separator',
      type: 'separator',
    },
    {
      key: 'delete',
      type: 'action',
      label: MOMENTS_DETAIL_MESSAGES.MENU.DELETE,
      onSelect: () => setIsDeleteDialogOpen(true),
    },
  ];

  return (
    <>
      <IconDropdownMenu
        ariaLabel={MOMENTS_DETAIL_MESSAGES.MENU.LABEL}
        icon={<MoreVertical className="text-text h-5 w-5" />}
      >
        {menuItems.map((item) => {
          if (item.type === 'separator') {
            return <DropdownMenuSeparator key={item.key} className="bg-border my-1 h-px" />;
          }

          return (
            <DropdownMenuItem key={item.key} onSelect={item.onSelect}>
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </IconDropdownMenu>

      <ConfirmDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>{MOMENTS_DETAIL_MESSAGES.DELETE_DIALOG.TITLE}</ConfirmDialogTitle>
            <ConfirmDialogDescription>
              {MOMENTS_DETAIL_MESSAGES.DELETE_DIALOG.DESCRIPTION}
            </ConfirmDialogDescription>
          </ConfirmDialogHeader>
          <ConfirmDialogFooter>
            <ConfirmDialogClose asChild>
              <Button variant="secondary" size="sm">
                {MOMENTS_DETAIL_MESSAGES.DELETE_DIALOG.CANCEL}
              </Button>
            </ConfirmDialogClose>
            <Button size="sm" onClick={handleDeleteConfirm} isLoading={isDeleting}>
              {MOMENTS_DETAIL_MESSAGES.DELETE_DIALOG.CONFIRM}
            </Button>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>
    </>
  );
}

PostDetailMenu.displayName = 'PostDetailMenu';
