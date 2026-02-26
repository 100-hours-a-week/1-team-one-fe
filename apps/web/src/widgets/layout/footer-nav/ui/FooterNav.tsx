import { useRouter } from 'next/router';

import { useUserProfileQuery } from '@/src/features/user-profile';
import { buildMomentsUserFeedPath, ROUTES } from '@/src/shared/routes';

import { navigationItems } from '../model/navigation-items';
import { FooterNavItem } from './FooterNavItem';

export function FooterNav() {
  const router = useRouter();
  const currentPath = router.asPath.split('#')[0];
  const { data: currentUser } = useUserProfileQuery({ retry: false });

  const isActive = (href: string) => {
    return currentPath === href;
  };

  const resolvedItems = navigationItems.map((item) => {
    if (item.id !== 'userpage') return item;
    return {
      ...item,
      href: currentUser ? buildMomentsUserFeedPath(currentUser.userId) : ROUTES.LOGIN,
    };
  });

  return (
    <nav
      className="fixed bottom-0 left-1/2 flex h-16 w-full max-w-md -translate-x-1/2 items-center justify-around p-2 backdrop-blur-lg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {resolvedItems.map((item) => (
        <FooterNavItem
          key={item.id}
          label={item.label}
          href={item.href}
          icon={item.icon}
          isActive={isActive(item.href)}
        />
      ))}
    </nav>
  );
}
