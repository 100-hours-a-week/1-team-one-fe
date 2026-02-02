import { ROUTES } from '@/src/shared/routes';

import { APP_MAIN_MESSAGES } from './messages';

export type AppMainActionCard = {
  key: 'plan' | 'notifications';
  href: (typeof ROUTES)[keyof typeof ROUTES];
  title: string;
  image: string;
  description: string;
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
] as const;
