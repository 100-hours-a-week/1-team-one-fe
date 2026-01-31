import { DropdownMenu } from 'radix-ui';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from './lib/utils';

export const DropdownMenuRoot = DropdownMenu.Root;
export const DropdownMenuTrigger = DropdownMenu.Trigger;
export const DropdownMenuGroup = DropdownMenu.Group;
export const DropdownMenuPortal = DropdownMenu.Portal;
export const DropdownMenuSeparator = DropdownMenu.Separator;

export function DropdownMenuContent({
  className,
  sideOffset = 8,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownMenu.Content>) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        sideOffset={sideOffset}
        className={cn(
          'bg-bg text-text z-50 min-w-48 rounded-md p-1 shadow-lg',
          'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
          className,
        )}
        {...props}
      />
    </DropdownMenu.Portal>
  );
}

export function DropdownMenuItem({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownMenu.Item>) {
  return (
    <DropdownMenu.Item
      className={cn(
        'focus:bg-bg-subtle data-highlighted:bg-bg-subtle flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm outline-none select-none',
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuLabel({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownMenu.Label>) {
  return (
    <DropdownMenu.Label
      className={cn('text-text-muted px-3 py-2 text-xs font-medium', className)}
      {...props}
    />
  );
}
