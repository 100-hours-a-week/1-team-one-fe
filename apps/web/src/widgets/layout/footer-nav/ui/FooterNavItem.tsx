import { cn } from '@repo/ui/lib/utils';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

export interface FooterNavItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  isActive?: boolean;
  isMain?: boolean;
}

export function FooterNavItem({
  label,
  href,
  icon: Icon,
  isActive = false,
  isMain = false,
}: FooterNavItemProps) {
  const iconSize = isMain ? 28 : 24;

  const baseClasses = cn(
    'flex min-h-[44px] flex-col items-center min-w-18 justify-center gap-1 rounded-lg py-2',
    'transition-colors duration-base',
    'focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-focus-ring',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    !isActive && !isMain && 'text-text-muted hover:text-text hover:bg-bg-subtle',
    (isActive || isMain) && 'text-brand bg-brand-50',
  );

  return (
    <Link href={href} className={baseClasses} aria-current={isActive ? 'page' : undefined}>
      <Icon size={iconSize} strokeWidth={isActive || isMain ? 1.5 : 1.3} />
      <span className={cn('text-xs font-medium', (isActive || isMain) && 'font-semibold')}>
        {label}
      </span>
    </Link>
  );
}
