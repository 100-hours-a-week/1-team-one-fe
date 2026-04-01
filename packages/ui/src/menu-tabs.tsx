import { cva, type VariantProps } from 'class-variance-authority';
import { Tabs as TabsPrimitive } from 'radix-ui';
import {
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { cn } from './lib/utils';

const menuTabsListVariants = cva('flex w-full items-center gap-1 rounded-xl p-1');

const menuTabTriggerVariants = cva(
  [
    'inline-flex w-full flex-1 items-center justify-center',
    'relative',
    'rounded-none',
    'border-b-4',
    'border-transparent',
    'pb-1',
    'font-medium',
    'transition-all',
    'duration-base',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-focus-ring',
    'focus-visible:ring-offset-2',
    'focus-visible:ring-offset-bg',
    'data-[state=active]:border-brand-700',
    'data-[state=active]:text-brand-700',
    'data-[state=inactive]:text-text-muted',
    'data-[state=inactive]:hover:text-text',
    'disabled:pointer-events-none',
    'disabled:opacity-[var(--disabled-opacity)]',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 px-2.5 text-xs',
        md: 'h-9 px-3 text-sm',
        lg: 'h-10 px-4 text-sm',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface MenuTabItem<TValue extends string = string> {
  value: TValue;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface MenuTabsProps<TValue extends string = string>
  extends
    Omit<
      ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
      'children' | 'value' | 'defaultValue' | 'onValueChange'
    >,
    VariantProps<typeof menuTabTriggerVariants> {
  menus: readonly MenuTabItem<TValue>[];
  value?: TValue;
  defaultValue?: TValue;
  onValueChange?: (value: TValue) => void;
  onTabClick?: (item: MenuTabItem<TValue>, event: MouseEvent<HTMLButtonElement>) => void;
  listClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

function getFirstEnabledMenuValue<TValue extends string>(
  menus: readonly MenuTabItem<TValue>[],
): TValue | undefined {
  return menus.find((menu) => !menu.disabled)?.value;
}

function isEnabledMenuValue<TValue extends string>(
  menus: readonly MenuTabItem<TValue>[],
  value: TValue | undefined,
): value is TValue {
  if (!value) return false;
  return menus.some((menu) => menu.value === value && !menu.disabled);
}

export function MenuTabs<TValue extends string = string>({
  menus,
  value,
  defaultValue,
  onValueChange,
  onTabClick,
  className,
  listClassName,
  triggerClassName,
  contentClassName,
  size,
  ...props
}: MenuTabsProps<TValue>) {
  const firstEnabledValue = getFirstEnabledMenuValue(menus);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<TValue | undefined>(() => {
    if (isEnabledMenuValue(menus, defaultValue)) return defaultValue;
    return firstEnabledValue;
  });

  const resolvedValue = isControlled ? value : internalValue;
  const selectedValue = isEnabledMenuValue(menus, resolvedValue)
    ? resolvedValue
    : firstEnabledValue;

  useEffect(() => {
    if (isControlled) return;
    if (selectedValue === internalValue) return;
    setInternalValue(selectedValue);
  }, [internalValue, isControlled, selectedValue]);

  if (!selectedValue) {
    return <div className={cn('w-full', className)} {...props} />;
  }

  const handleValueChange = (nextValue: string) => {
    const next = nextValue as TValue;
    if (!isControlled) {
      setInternalValue(next);
    }
    onValueChange?.(next);
  };

  return (
    <TabsPrimitive.Root
      value={selectedValue}
      onValueChange={handleValueChange}
      className={cn('flex w-full flex-col gap-3', className)}
      {...props}
    >
      <TabsPrimitive.List className={cn(menuTabsListVariants(), listClassName)}>
        {menus.map((menu) => (
          <TabsPrimitive.Trigger
            key={menu.value}
            value={menu.value}
            disabled={menu.disabled}
            className={cn(menuTabTriggerVariants({ size }), triggerClassName)}
            onClick={(event) => onTabClick?.(menu, event)}
          >
            {menu.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>

      {menus.map((menu) => (
        <TabsPrimitive.Content
          key={menu.value}
          value={menu.value}
          className={cn('w-full outline-none', contentClassName)}
        >
          {menu.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}

MenuTabs.displayName = 'MenuTabs';
