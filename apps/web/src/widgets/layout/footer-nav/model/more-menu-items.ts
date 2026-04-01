import type { LucideIcon } from 'lucide-react';
import { ListTodo, Trophy } from 'lucide-react';

import { APP_ROUTES } from '@/src/shared/routes';

export interface FooterMoreMenuItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

export const footerMoreMenuItems: readonly FooterMoreMenuItem[] = [
  {
    id: 'quest',
    label: '퀘스트',
    href: APP_ROUTES.QUEST,
    icon: ListTodo,
  },
  {
    id: 'leaderboard',
    label: '리더보드',
    href: APP_ROUTES.LEADERBOARD,
    icon: Trophy,
  },
];
