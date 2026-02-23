import { cn } from '@repo/ui/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const helperTextVariants = cva(['mt-1.5 text-sm'], {
  variants: {
    type: {
      default: 'text-(--color-fg-muted)',
      error: 'text-error-600',
    },
  },
  defaultVariants: {
    type: 'default',
  },
});

export interface FormHelperTextProps
  extends React.HTMLAttributes<HTMLParagraphElement>, VariantProps<typeof helperTextVariants> {
  variant?: 'default' | 'borderless';
}

export function FormHelperText({
  className,
  type,
  variant = 'default',
  children,
  ...props
}: FormHelperTextProps) {
  const hasContent = children && children !== '\u00A0';

  // Borderless variant: don't render if empty
  if (variant === 'borderless' && !hasContent) {
    return null;
  }

  return (
    <p
      className={cn(helperTextVariants({ type }), variant === 'default' && 'min-h-5', className)}
      {...props}
    >
      {children}
    </p>
  );
}
