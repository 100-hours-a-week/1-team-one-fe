import { ROUTES } from '@/src/shared/routes';

import { APP_MAIN_MESSAGES } from './messages';

export type AppMainActionCard = {
  key: 'plan' | 'notifications' | 'reports';
  href: (typeof ROUTES)[keyof typeof ROUTES];
  title: string;
  image: string;
  description: string;
  containerClassName?: string;
};

export const APP_MAIN_ACTION_CARDS: AppMainActionCard[] = [
  {
    key: 'plan',
    href: ROUTES.PLAN,
    title: APP_MAIN_MESSAGES.ACTIONS.PLAN.TITLE,
    image: '/images/main/plan.png',
    description: APP_MAIN_MESSAGES.ACTIONS.PLAN.DESCRIPTION,
  },
  {
    key: 'notifications',
    href: ROUTES.ALARM,
    title: APP_MAIN_MESSAGES.ACTIONS.NOTIFICATIONS.TITLE,
    image: '/images/main/clock.png',
    description: APP_MAIN_MESSAGES.ACTIONS.NOTIFICATIONS.DESCRIPTION,
  },
  {
    key: 'reports',
    href: ROUTES.REPORTS,
    title: APP_MAIN_MESSAGES.ACTIONS.REPORTS.TITLE,
    image: '/images/main/report.png',
    description: APP_MAIN_MESSAGES.ACTIONS.REPORTS.DESCRIPTION,
    containerClassName: 'col-span-2',
  },
] as const;
