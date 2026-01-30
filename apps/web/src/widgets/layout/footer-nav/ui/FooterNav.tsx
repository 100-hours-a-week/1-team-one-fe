import { useRouter } from 'next/router';

import { navigationItems } from '../model/navigation-items';
import { FooterNavItem } from './FooterNavItem';

export function FooterNav() {
  const router = useRouter();

  const isActive = (href: string) => {
    return router.pathname === href;
  };

  return (
    <nav
      className="fixed bottom-0 left-1/2 flex h-16 w-full max-w-md -translate-x-1/2 items-center justify-around p-2 backdrop-blur-lg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {navigationItems.map((item) => (
        <FooterNavItem
          key={item.id}
          label={item.label}
          href={item.href}
          icon={item.icon}
          isActive={isActive(item.href)}
          isMain={item.isMain}
        />
      ))}
    </nav>
  );
}
