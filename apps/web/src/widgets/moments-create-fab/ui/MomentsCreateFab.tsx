import { cn } from '@repo/ui/lib/utils';
import { NotebookPen } from 'lucide-react';
import Link from 'next/link';

import { ROUTES } from '@/src/shared/routes';

import { MOMENTS_CREATE_FAB_MESSAGES } from '../config/messages';

interface MomentsCreateFabProps {
  isLoggedIn: boolean;
  onLoginRequired?: () => void;
}

export function MomentsCreateFab({ isLoggedIn, onLoginRequired }: MomentsCreateFabProps) {
  const fabClassName = [
    'fixed left-1/2 bottom-24 -translate-x-1/2',
    'z-(--z-fixed) flex w-fit items-center justify-center',
    'rounded-2xl px-8 py-2',
    'bg-surface',
    'border border-white/20',
    'shadow-[0_12px_30px_rgba(0,0,0,0.18)]',
    'ring-1 ring-white/15',
    'transition-all duration-200',
    'hover:bg-white/18 hover:border-white/30 hover:shadow-[0_16px_40px_rgba(0,0,0,0.22)]',
    'active:scale-[0.98]',
  ];
  const imojiClass = 'text-brand h-4 w-4 mr-2';

  if (!isLoggedIn) {
    return (
      <button
        onClick={onLoginRequired}
        className={cn(fabClassName)}
        aria-label={MOMENTS_CREATE_FAB_MESSAGES.BUTTON.ARIA_LABEL_LOGIN_REQUIRED}
      >
        <NotebookPen className={imojiClass} strokeWidth={2.5} />
        <span>글쓰기</span>
      </button>
    );
  }

  return (
    <Link
      href={ROUTES.MOMENTS_NEW}
      className={cn(fabClassName)}
      aria-label={MOMENTS_CREATE_FAB_MESSAGES.BUTTON.ARIA_LABEL}
    >
      <NotebookPen className={imojiClass} strokeWidth={2.5} />
      <span>글쓰기</span>
    </Link>
  );
}

MomentsCreateFab.displayName = 'MomentsCreateFab';
