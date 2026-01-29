import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';
import type { ComponentProps, ReactNode } from 'react';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type ToastVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastOptions = {
  title: string;
  description?: string;
  icon?: ReactNode;
  variant?: ToastVariant;
  duration?: number;
  action?: ToastAction;
};

export type ToastProviderProps = ComponentProps<typeof SonnerToaster> & {
  position?: ToastPosition;
  duration?: number;
};

const mapAction = (action?: ToastAction) => {
  if (!action) return undefined;
  return {
    label: action.label,
    onClick: action.onClick,
  };
};

export function toast({
  title,
  description,
  icon,
  variant = 'default',
  duration,
  action,
}: ToastOptions) {
  const options = {
    description,
    icon,
    duration,
    action: mapAction(action),
  } as const;

  switch (variant) {
    case 'success':
      return sonnerToast.success(title, options);
    case 'warning':
      return sonnerToast.warning(title, options);
    case 'error':
      return sonnerToast.error(title, options);
    case 'info':
      return sonnerToast.info(title, options);
    default:
      return sonnerToast(title, options);
  }
}

export function useToast() {
  return { toast };
}

export function ToastProvider({
  position = 'top-right',
  duration = 4000,
  ...props
}: ToastProviderProps) {
  return (
    <SonnerToaster
      position={position}
      duration={duration}
      richColors
      closeButton
      toastOptions={{
        className: 'bg-surface text-text border-border shadow-lg',
        descriptionClassName: 'text-text-muted',
      }}
      {...props}
    />
  );
}
