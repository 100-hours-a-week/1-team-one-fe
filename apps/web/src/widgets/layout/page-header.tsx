import { cn } from '@repo/ui/lib/utils';
import { cva } from 'class-variance-authority';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import type React from 'react';

export type HeaderConfig = {
  variant?: 'main' | 'sub';
  title?: React.ReactNode;
  back?: boolean;
  action?: React.ReactNode;
};

const pageHeaderVariants = cva([
  'sticky top-0 z-10',
  'flex items-center justify-between',
  'w-full h-16',
  'px-4 py-3',
  'sm:px-6',
  'bg-bg',
]);

export interface PageHeaderProps extends Omit<React.ComponentPropsWithoutRef<'header'>, 'title'> {
  ref?: React.Ref<HTMLElement>;

  title?: React.ReactNode;
  backAction?: boolean;

  action?: React.ReactNode;
}

function HeaderBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label="뒤로가기"
      onClick={() => router.back()}
      className="hover:bg-bg-subtle/60 inline-flex h-9 w-9 items-center justify-center rounded-full transition active:scale-[0.98]"
    >
      <ChevronLeft className="text-text h-5 w-5" />
    </button>
  );
}

export function PageHeader({
  ref,
  className,
  title,
  backAction = false,
  action,
  children,
  ...props
}: PageHeaderProps) {
  return (
    <header ref={ref} className={cn(pageHeaderVariants(), className)} {...props}>
      <div className="flex min-w-0 items-center gap-3">
        {backAction && (
          <div className="shrink-0">
            <HeaderBackButton />
          </div>
        )}

        {title && (
          <h1 className="text-text min-w-0 truncate text-xl leading-6 font-semibold">{title}</h1>
        )}

        {children}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

PageHeader.displayName = 'PageHeader';
