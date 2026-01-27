import * as Dialog from '@radix-ui/react-dialog';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from './lib/utils';

export const BottomSheet = Dialog.Root;
export const BottomSheetTrigger = Dialog.Trigger;
export const BottomSheetClose = Dialog.Close;

interface BottomSheetContentProps extends ComponentPropsWithoutRef<typeof Dialog.Content> {
  children: ReactNode;
}

export function BottomSheetContent({ className, children, ...props }: BottomSheetContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-neutral-900/40" />
      <Dialog.Content
        className={cn(
          'fixed inset-x-0 bottom-0 z-50',
          'border-border bg-bg rounded-t-2xl border',
          'px-6 pt-5 shadow-lg',
          className,
        )}
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }}
        {...props}
      >
        <div className="bg-border mx-auto mb-4 h-1.5 w-12 rounded-full" aria-hidden="true" />
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}

interface BottomSheetTitleProps extends ComponentPropsWithoutRef<typeof Dialog.Title> {}

export function BottomSheetTitle({ className, ...props }: BottomSheetTitleProps) {
  return <Dialog.Title className={cn('text-text text-lg font-semibold', className)} {...props} />;
}

interface BottomSheetDescriptionProps extends ComponentPropsWithoutRef<typeof Dialog.Description> {}

export function BottomSheetDescription({ className, ...props }: BottomSheetDescriptionProps) {
  return <Dialog.Description className={cn('text-text-muted text-sm', className)} {...props} />;
}
