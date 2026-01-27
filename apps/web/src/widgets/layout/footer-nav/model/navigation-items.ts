import type { LucideIcon } from 'lucide-react';
import { BarChart3, Dumbbell, Home, Settings, Users } from 'lucide-react';

import { APP_ROUTES } from '@/src/shared/routes';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  isMain?: boolean;
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'statistics',
    label: '통계',
    href: '/app/statistics',
    icon: BarChart3,
  },
  {
    id: 'plan',
    label: '플랜',
    href: APP_ROUTES.PLAN,
    icon: Dumbbell,
  },
  {
    id: 'home',
    label: '홈',
    href: APP_ROUTES.MAIN,
    icon: Home,
    isMain: true,
  },
  {
    id: 'community',
    label: '커뮤니티',
    href: '/app/community',
    icon: Users,
  },
  {
    id: 'settings',
    label: '설정',
    href: APP_ROUTES.SETTINGS_NOTIFICATIONS,
    icon: Settings,
  },
];
