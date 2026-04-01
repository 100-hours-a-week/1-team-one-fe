import { DropdownMenuContent, DropdownMenuRoot, DropdownMenuTrigger } from '@repo/ui/dropdown-menu';
import { cn } from '@repo/ui/lib/utils';
import type { ReactNode } from 'react';

type IconDropdownMenuAlign = 'center' | 'end' | 'start';

export interface IconDropdownMenuProps {
  ariaLabel: string;
  icon: ReactNode;
  children: ReactNode;
  align?: IconDropdownMenuAlign;
  triggerClassName?: string;
  contentClassName?: string;
}

const triggerBaseClassName =
  'hover:bg-bg-subtle/60 inline-flex h-9 w-9 items-center justify-center rounded-full transition active:scale-[0.98]';

export function IconDropdownMenu({
  ariaLabel,
  icon,
  children,
  align = 'end',
  triggerClassName,
  contentClassName,
}: IconDropdownMenuProps) {
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className={cn(triggerBaseClassName, triggerClassName)}
        >
          {icon}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={contentClassName}>
        {children}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

IconDropdownMenu.displayName = 'IconDropdownMenu';
