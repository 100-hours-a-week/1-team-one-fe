import type { LucideIcon } from 'lucide-react';
import { Bell, CalendarRange } from 'lucide-react';

import { ROUTES } from '@/src/shared/routes';

import { APP_MAIN_MESSAGES } from './messages';

export type AppMainActionCard = {
  key: 'plan' | 'notifications';
  href: (typeof ROUTES)[keyof typeof ROUTES];
  title: string;
  Icon: LucideIcon;
};

export const APP_MAIN_ACTION_CARDS: AppMainActionCard[] = [
  {
    key: 'plan',
    href: ROUTES.PLAN,
    title: APP_MAIN_MESSAGES.ACTIONS.PLAN.TITLE,
    Icon: CalendarRange,
  },
  {
    key: 'notifications',
    href: ROUTES.SETTINGS_NOTIFICATIONS,
    title: APP_MAIN_MESSAGES.ACTIONS.NOTIFICATIONS.TITLE,
    Icon: Bell,
  },
] as const;
