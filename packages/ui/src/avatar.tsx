import { Avatar as AvatarPrimitive } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';

import { cn } from './lib/utils';

const avatarVariants = cva(
  [
    'relative inline-flex items-center justify-center overflow-hidden',
    'bg-bg-subtle text-text',
    'select-none',
  ],
  {
    variants: {
      size: {
        sm: 'h-10 w-10 text-sm',
        md: 'h-12 w-12 text-base',
        lg: 'h-16 w-16 text-lg',
      },
      shape: {
        circle: 'rounded-full',
        squircle: 'rounded-[34%_34%_34%_34%/28%_28%_40%_40%]',
      },
    },
    defaultVariants: {
      size: 'md',
      shape: 'circle',
    },
  },
);

type AvatarBaseProps = Omit<
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
  'children'
>;

export interface AvatarProps extends AvatarBaseProps, VariantProps<typeof avatarVariants> {
  src?: string | null;
  alt?: string;
  name?: string;
  fallbackText?: string;
  fallbackDelayMs?: number;
  imageSlot?: React.ReactNode;
  badge?: React.ReactNode;
}

const getInitials = (name?: string, fallbackText?: string) => {
  if (fallbackText) return fallbackText;
  if (!name) return '?';

  const trimmed = name.trim();
  if (!trimmed) return '?';

  const [first] = Array.from(trimmed);
  if (!first) return '?';

  return first.toUpperCase();
};

export function Avatar({
  src,
  alt,
  name,
  fallbackText,
  fallbackDelayMs = 0,
  imageSlot,
  size,
  shape,
  badge,
  className,
  ...props
}: AvatarProps) {
  const ariaLabel = alt ?? name ?? 'avatar';
  const initials = getInitials(name, fallbackText);

  return (
    <div className="relative inline-flex">
      <AvatarPrimitive.Root className={cn(avatarVariants({ size, shape }), className)} {...props}>
        {imageSlot ? (
          <>
            <div
              aria-hidden="true"
              className="flex h-full w-full items-center justify-center font-semibold"
            >
              {initials}
            </div>
            {imageSlot}
          </>
        ) : (
          <>
            <AvatarPrimitive.Image
              src={src ?? undefined}
              alt={ariaLabel}
              className="h-full w-full object-cover"
            />
            <AvatarPrimitive.Fallback
              delayMs={fallbackDelayMs}
              className="flex h-full w-full items-center justify-center font-semibold"
            >
              {initials}
            </AvatarPrimitive.Fallback>
          </>
        )}
      </AvatarPrimitive.Root>

      {badge && <div className="absolute -right-0.5 -bottom-0.5">{badge}</div>}
    </div>
  );
}

Avatar.displayName = 'Avatar';
