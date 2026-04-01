import { cn } from '@repo/ui/lib/utils';
import { cva } from 'class-variance-authority';
import Link from 'next/link';
import type React from 'react';

import { OptimizedImage } from '@/src/shared/ui/optimized-image';

import { MAIN_HEADER_MESSAGES } from '../config/messages';
import { MainHeaderMenu } from './MainHeaderMenu';
import { MainHeaderNotifications } from './MainHeaderNotifications';

const mainHeaderVariants = cva([
  'sticky top-0 z-10',
  'flex items-center justify-between',
  'w-full, h-16',
  'px-4 py-3',
  'sm:px-6',
  'bg-bg',
]);

export function MainHeader({ className, ...props }: React.ComponentPropsWithoutRef<'header'>) {
  return (
    <header className={cn(mainHeaderVariants(), className)} {...props}>
      <Link href="/app" className="shrink-0">
        <OptimizedImage
          src="/icons/logo.svg"
          alt={MAIN_HEADER_MESSAGES.LOGO_ALT}
          width={110}
          height={40}
        />
      </Link>

      <div className="flex items-center gap-2">
        <MainHeaderNotifications />
        <MainHeaderMenu />
      </div>
    </header>
  );
}

MainHeader.displayName = 'MainHeader';
