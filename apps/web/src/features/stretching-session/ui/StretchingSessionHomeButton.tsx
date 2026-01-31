import { Button } from '@repo/ui/button';
import { cn } from '@repo/ui/lib/utils';
import { Home } from 'lucide-react';
import Link from 'next/link';

import { ROUTES } from '@/src/shared/routes';

import { STRETCHING_SESSION_MESSAGES } from '../config/messages';

type StretchingSessionHomeButtonVariant = 'icon' | 'label';

type StretchingSessionHomeButtonProps = {
  variant?: StretchingSessionHomeButtonVariant;
  className?: string;
};

export function StretchingSessionHomeButton({
  variant = 'label',
  className,
}: StretchingSessionHomeButtonProps) {
  const isIconOnly = variant === 'icon';
  const label = STRETCHING_SESSION_MESSAGES.NAV.HOME_LABEL;
  const ariaLabel = STRETCHING_SESSION_MESSAGES.NAV.HOME_ICON_ARIA;

  return (
    <Link href={ROUTES.MAIN} aria-label={isIconOnly ? ariaLabel : undefined}>
      <Button
        size={isIconOnly ? 'sm' : 'md'}
        className={cn(isIconOnly && 'h-10 w-10 px-0', className)}
      >
        <Home className="h-5 w-5" aria-hidden="true" />
        {!isIconOnly && <span>{label}</span>}
      </Button>
    </Link>
  );
}
