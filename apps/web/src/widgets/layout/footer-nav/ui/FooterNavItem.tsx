import { cn } from '@repo/ui/lib/utils';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import type { MouseEventHandler } from 'react';

export interface FooterNavItemProps {
  label: string;
  icon: LucideIcon;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isActive?: boolean;
  isMain?: boolean;
  ariaControls?: string;
  ariaExpanded?: boolean;
  ariaHaspopup?: 'menu';
}

export function FooterNavItem({
  label,
  href,
  onClick,
  icon: Icon,
  isActive = false,
  isMain = false,
  ariaControls,
  ariaExpanded,
  ariaHaspopup,
}: FooterNavItemProps) {
  const iconSize = isMain ? 28 : 24;

  const baseClasses = cn(
    'flex min-h-[44px] flex-col items-center min-w-18 justify-center gap-1 rounded-lg py-2',
    'transition-colors duration-base',
    'focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-focus-ring',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    !isActive && 'text-text-muted hover:text-text hover:bg-bg-subtle',
    isActive && 'text-brand bg-brand-50',
  );

  if (onClick) {
    return (
      <button
        type="button"
        className={baseClasses}
        onClick={onClick}
        aria-pressed={isActive}
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        aria-haspopup={ariaHaspopup}
      >
        <Icon size={iconSize} strokeWidth={isActive ? 1.5 : 1.3} />
        <span className={cn('text-xs font-medium', isActive && 'font-semibold')}>{label}</span>
      </button>
    );
  }

  if (!href) return null;

  return (
    <Link href={href} className={baseClasses} aria-current={isActive ? 'page' : undefined}>
      <Icon size={iconSize} strokeWidth={isActive ? 1.5 : 1.3} />
      <span className={cn('text-xs font-medium', isActive && 'font-semibold')}>{label}</span>
    </Link>
  );
}
