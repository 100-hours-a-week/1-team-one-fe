import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';
import { cn } from './lib/utils';

const cardVariants = cva(
  ['rounded-[var(--radius-lg)]', 'transition-all', 'duration-[var(--duration-base)]'],
  {
    variants: {
      variant: {
        default: ['bg-surface', 'border border-border'],
        outline: ['bg-transparent', 'border border-border-strong'],
        elevated: ['bg-surface', 'shadow-[var(--shadow-sm)]'],
        selectable: [
          'bg-surface',
          'border-2',
          'cursor-pointer',
          'data-[selected=false]:border-border',
          'data-[selected=false]:hover:border-border-strong',
          'data-[selected=false]:hover:bg-bg-subtle',
          'data-[selected=true]:border-brand',
          'data-[selected=true]:bg-brand-50',
          'data-[disabled=true]:cursor-not-allowed',
          'data-[disabled=true]:opacity-[var(--disabled-opacity)]',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-focus-ring',
          'focus-visible:ring-offset-2',
        ],
        disabled: ['bg-bg-muted'],
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  },
);

type CardBaseDivProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'onClick'>;

export interface CardProps extends CardBaseDivProps, VariantProps<typeof cardVariants> {
  ref?: React.Ref<HTMLDivElement | HTMLButtonElement>;
  selected?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement | HTMLButtonElement>;
}

export function Card({
  ref,
  className,
  variant,
  padding,
  selected = false,
  disabled = false,
  onClick,
  children,
  ...props
}: CardProps) {
  const isSelectable = variant === 'selectable';

  const dataSelected = isSelectable ? selected : undefined;
  const dataDisabled = isSelectable ? disabled : undefined;

  const handleClick: React.MouseEventHandler<HTMLDivElement | HTMLButtonElement> = (event) => {
    if (disabled) return;
    onClick?.(event);
  };

  const commonClassName = cn(cardVariants({ variant, padding }), className);

  if (isSelectable) {
    const buttonProps = props as Omit<React.ComponentPropsWithoutRef<'button'>, 'onClick' | 'ref'>;

    return (
      <button
        {...buttonProps}
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        className={commonClassName}
        data-selected={dataSelected}
        data-disabled={dataDisabled}
        aria-pressed={selected}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={handleClick}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      {...props}
      ref={ref as React.Ref<HTMLDivElement>}
      className={commonClassName}
      data-selected={dataSelected}
      data-disabled={dataDisabled}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}

Card.displayName = 'Card';

type DivProps = React.ComponentPropsWithoutRef<'div'> & { ref?: React.Ref<HTMLDivElement> };
type H3Props = React.ComponentPropsWithoutRef<'h3'> & { ref?: React.Ref<HTMLHeadingElement> };
type PProps = React.ComponentPropsWithoutRef<'p'> & { ref?: React.Ref<HTMLParagraphElement> };

export function CardHeader({ ref, className, ...props }: DivProps) {
  return <div ref={ref} className={cn('flex flex-col space-y-1.5', className)} {...props} />;
}
CardHeader.displayName = 'CardHeader';

export function CardTitle({ ref, className, ...props }: H3Props) {
  return (
    <h3
      ref={ref}
      className={cn('text-text text-lg leading-none font-semibold tracking-tight', className)}
      {...props}
    />
  );
}
CardTitle.displayName = 'CardTitle';

export function CardDescription({ ref, className, ...props }: PProps) {
  return <p ref={ref} className={cn('text-text-muted text-sm', className)} {...props} />;
}
CardDescription.displayName = 'CardDescription';

export function CardContent({ ref, className, ...props }: DivProps) {
  return <div ref={ref} className={cn('', className)} {...props} />;
}
CardContent.displayName = 'CardContent';

export function CardFooter({ ref, className, ...props }: DivProps) {
  return <div ref={ref} className={cn('flex items-center', className)} {...props} />;
}
CardFooter.displayName = 'CardFooter';
