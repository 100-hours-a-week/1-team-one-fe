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
import { cn } from '@repo/ui/lib/utils';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/router';
import { type MouseEventHandler, useState } from 'react';

import { ROUTES } from '@/src/shared/routes';

import { MOMENTS_LIKE_MESSAGES } from '../config/messages';

interface MomentsLikeButtonProps {
  likeCount: number;
  isLiked: boolean;
  isLoggedIn: boolean;
  onLike?: () => void;
}

export function MomentsLikeButton({
  likeCount,
  isLiked,
  isLoggedIn,
  onLike,
}: MomentsLikeButtonProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isLoggedIn) {
      setIsDialogOpen(true);
      return;
    }

    onLike?.();
  };

  const handleLoginConfirm = () => {
    setIsDialogOpen(false);
    void router.push(ROUTES.LOGIN);
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label={MOMENTS_LIKE_MESSAGES.BUTTON.ARIA_LABEL}
        aria-pressed={isLiked}
        onClick={handleClick}
        className={cn(
          'gap-1 px-2',
          isLiked ? 'text-brand-600 hover:text-brand-700' : 'text-text-subtle',
        )}
      >
        <Heart className={cn('h-4 w-4', isLiked ? 'fill-current' : undefined)} aria-hidden="true" />
        <span className="text-sm font-medium tabular-nums">{likeCount}</span>
      </Button>

      <ConfirmDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <ConfirmDialogContent>
          <ConfirmDialogHeader>
            <ConfirmDialogTitle>{MOMENTS_LIKE_MESSAGES.DIALOG.TITLE}</ConfirmDialogTitle>
            <ConfirmDialogDescription>
              {MOMENTS_LIKE_MESSAGES.DIALOG.DESCRIPTION}
            </ConfirmDialogDescription>
          </ConfirmDialogHeader>
          <ConfirmDialogFooter>
            <ConfirmDialogClose asChild>
              <Button variant="secondary" size="sm" className="flex-1">
                {MOMENTS_LIKE_MESSAGES.DIALOG.CANCEL}
              </Button>
            </ConfirmDialogClose>
            <Button size="sm" onClick={handleLoginConfirm} className="flex-1">
              {MOMENTS_LIKE_MESSAGES.DIALOG.CONFIRM}
            </Button>
          </ConfirmDialogFooter>
        </ConfirmDialogContent>
      </ConfirmDialog>
    </>
  );
}

MomentsLikeButton.displayName = 'MomentsLikeButton';
