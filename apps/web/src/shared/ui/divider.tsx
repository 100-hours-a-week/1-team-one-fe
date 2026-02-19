import { type HTMLAttributes } from 'react';

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'bold' | 'dashed';
}

export function Divider({
  orientation = 'horizontal',
  variant = 'default',
  className = '',
  ...props
}: DividerProps) {
  const baseStyles = 'border-gray-200';

  const orientationStyles = {
    horizontal: 'w-full border-t',
    vertical: 'h-full border-l',
  };

  const variantStyles = {
    default: '',
    bold: 'border-t-2',
    dashed: 'border-dashed',
  };

  const combinedClassName = [
    baseStyles,
    orientationStyles[orientation],
    variantStyles[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <hr className={combinedClassName} {...props} />;
}
