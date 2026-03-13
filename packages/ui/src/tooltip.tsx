import { Tooltip as TooltipPrimitive } from 'radix-ui';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from './lib/utils';

export const TooltipProvider = TooltipPrimitive.Provider;
export const TooltipRoot = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export const TooltipPortal = TooltipPrimitive.Portal;

export function TooltipContent({
  className,
  side = 'top',
  sideOffset = 8,
  ...props
}: ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        side={side}
        sideOffset={sideOffset}
        className={cn(
          'z-50 rounded-md bg-black/60 px-3 py-2 text-white',
          'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}

export function TooltipArrow({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>) {
  return <TooltipPrimitive.Arrow className={cn('fill-black/60', className)} {...props} />;
}

export const Tooltip = {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Content: TooltipContent,
  Arrow: TooltipArrow,
} as const;
