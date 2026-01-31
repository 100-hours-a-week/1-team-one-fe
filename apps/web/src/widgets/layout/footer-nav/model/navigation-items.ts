import type { LucideIcon } from 'lucide-react';
import { ChartPie, CircleEllipsis, Home, Settings, Users } from 'lucide-react';

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
    id: 'more',
    label: '더보기',
    href: '/app/ready?page=more',
    icon: CircleEllipsis,
  },
  {
    id: 'statistic',
    label: '통계',
    href: '/app/ready?page=statistic',
    icon: ChartPie,
    isMain: true,
  },
  {
    id: 'main',
    label: '메인',
    href: APP_ROUTES.MAIN,
    icon: Home,
  },
  {
    id: 'community',
    label: '운동모먼트',
    href: '/app/ready?page=community',
    icon: Users,
  },
  {
    id: 'userpage',
    label: '내페이지',
    href: '/app/ready?page=userpage',
    icon: Settings,
  },
];
