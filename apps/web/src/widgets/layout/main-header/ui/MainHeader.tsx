import { cn } from '@repo/ui/lib/utils';
import { cva } from 'class-variance-authority';
import { Bell } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';

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
        <Image
          src="/icons/logo-without-bg.svg"
          alt="Growing Developer"
          width={60}
          height={40}
          priority
        />
      </Link>

      <Link
        href="/app/settings/notifications"
        className="hover:bg-bg-subtle/60 inline-flex h-9 w-9 items-center justify-center rounded-full transition active:scale-[0.98]"
        aria-label="알림 설정"
      >
        <Bell className="text-text h-5 w-5" />
      </Link>
    </header>
  );
}

MainHeader.displayName = 'MainHeader';
