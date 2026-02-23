import { Card } from '@repo/ui/card';
import { cn } from '@repo/ui/lib/utils';
import Link from 'next/link';
import type { ReactNode } from 'react';

type LinkCardHeaderHeight = 'sm' | 'md' | 'lg';

export interface LinkCardProps {
  href: string;
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  headerHeight?: LinkCardHeaderHeight;
  className?: string;
  ariaLabel?: string;
}

const headerHeightClasses: Record<LinkCardHeaderHeight, string> = {
  sm: 'h-32',
  md: 'h-40',
  lg: 'h-52',
};

export function LinkCard({
  href,
  header,
  footer,
  children,
  headerHeight = 'md',
  className,
  ariaLabel,
}: LinkCardProps) {
  const headerHeightClassName = headerHeightClasses[headerHeight];

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn(
        'focus-visible:ring-focus-ring group focus-visible:ring-offset-bg block rounded-[var(--radius-lg)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
      )}
    >
      <Card
        padding="none"
        variant="elevated"
        className={cn('duration-base overflow-hidden transition-colors', className)}
      >
        {header && (
          <div className={cn('bg-bg-subtle w-full overflow-hidden', headerHeightClassName)}>
            <div className="h-full w-full">{header}</div>
          </div>
        )}
        <div className="flex flex-1 flex-col gap-3 p-4">
          {children}
          {footer && <div>{footer}</div>}
        </div>
      </Card>
    </Link>
  );
}
