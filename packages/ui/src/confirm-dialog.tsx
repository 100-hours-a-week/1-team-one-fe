import { Dialog } from 'radix-ui';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from './lib/utils';

export function ConfirmDialogContent({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof Dialog.Content>) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay
        className={cn(
          'fixed inset-0 z-50 bg-neutral-900/40',
          'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
        )}
      />
      <Dialog.Content
        className={cn(
          'bg-bg text-text border-border fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-xl',
          'data-[state=open]:animate-dialog-in data-[state=closed]:animate-dialog-out',
          className,
        )}
        {...props}
      />
    </Dialog.Portal>
  );
}

export const ConfirmDialogHeader = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div className={cn('flex flex-col gap-2', className)} {...props} />
);

export const ConfirmDialogFooter = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div className={cn('mt-6 flex items-stretch justify-center gap-2', className)} {...props} />
);

export function ConfirmDialogTitle({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof Dialog.Title>) {
  return <Dialog.Title className={cn('text-lg font-semibold', className)} {...props} />;
}

export function ConfirmDialogDescription({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof Dialog.Description>) {
  return <Dialog.Description className={cn('text-text-muted text-sm', className)} {...props} />;
}

export const ConfirmDialog = Dialog.Root;
export const ConfirmDialogTrigger = Dialog.Trigger;
export const ConfirmDialogClose = Dialog.Close;
