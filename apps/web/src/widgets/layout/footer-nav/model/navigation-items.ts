import type { LucideIcon } from 'lucide-react';
import { ChartPie, CircleEllipsis, Dumbbell, Settings, Users } from 'lucide-react';

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
    href: '/404', //TODO: 준비중으로 변경하기
    icon: CircleEllipsis,
  },
  {
    id: 'plan',
    label: '플랜',
    href: APP_ROUTES.PLAN,
    icon: Dumbbell,
  },
  {
    id: 'statistic',
    label: '통계',
    href: 'app/statistics',
    icon: ChartPie,
    isMain: true,
  },
  {
    id: 'community',
    label: '운동모먼트',
    href: '/app/community',
    icon: Users,
  },
  {
    id: 'userpage',
    label: '내페이지',
    href: '/404',
    icon: Settings,
  },
];
