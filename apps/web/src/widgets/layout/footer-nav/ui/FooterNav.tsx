import { cn } from '@repo/ui/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useUserProfileQuery } from '@/src/features/user-profile/query';
import { APP_ROUTES, buildMomentsUserFeedPath, ROUTES } from '@/src/shared/routes';

import { footerMoreMenuItems } from '../model/more-menu-items';
import { navigationItems } from '../model/navigation-items';
import { FooterNavItem } from './FooterNavItem';

const FOOTER_MORE_MENU_ID = 'footer-nav-more-menu';

function getNormalizedPath(asPath: string): string {
  const [pathWithoutHash = ''] = asPath.split('#');
  const [normalizedPath = ''] = pathWithoutHash.split('?');

  return normalizedPath;
}

function isMoreRoute(path: string): boolean {
  return path === APP_ROUTES.QUEST || path === APP_ROUTES.LEADERBOARD;
}

export function FooterNav() {
  const router = useRouter();
  const { data: currentUser } = useUserProfileQuery({ retry: false });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const currentPath = useMemo(() => getNormalizedPath(router.asPath), [router.asPath]);
  const isMoreRouteActive = isMoreRoute(currentPath);

  const isActive = (href: string) => {
    return currentPath === href;
  };

  useEffect(() => {
    setIsMoreMenuOpen(false);
  }, [currentPath]);

  useEffect(() => {
    if (!isMoreMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current?.contains(event.target as Node)) return;
      setIsMoreMenuOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsMoreMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMoreMenuOpen]);

  const resolvedItems = navigationItems.map((item) => {
    if (item.id !== 'userpage') return item;
    return {
      ...item,
      href: currentUser ? buildMomentsUserFeedPath(currentUser.userId) : ROUTES.LOGIN,
    };
  });

  const handleMoreMenuToggle = () => {
    setIsMoreMenuOpen((previous) => !previous);
  };

  const handleCloseMoreMenu = () => {
    setIsMoreMenuOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2"
    >
      <div
        id={FOOTER_MORE_MENU_ID}
        className={cn(
          'duration-base absolute bottom-full left-0 w-full rounded-t-2xl px-3 pt-3 pb-2 backdrop-blur-lg transition-all',
          isMoreMenuOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-2 opacity-0',
        )}
      >
        <div className="flex flex-col gap-2">
          {footerMoreMenuItems.map((item) => {
            const isSelected = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'duration-base flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isSelected
                    ? 'bg-brand-50 text-brand'
                    : 'text-text-muted hover:text-text hover:bg-bg-subtle',
                )}
                onClick={handleCloseMoreMenu}
                aria-current={isSelected ? 'page' : undefined}
              >
                <Icon size={16} strokeWidth={1.8} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <nav
        className="flex h-16 w-full items-center justify-around p-2 backdrop-blur-lg"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {resolvedItems.map((item) => {
          if (item.id === 'more') {
            return (
              <FooterNavItem
                key={item.id}
                label={item.label}
                icon={item.icon}
                onClick={handleMoreMenuToggle}
                isActive={isMoreRouteActive || isMoreMenuOpen}
                ariaControls={FOOTER_MORE_MENU_ID}
                ariaExpanded={isMoreMenuOpen}
                ariaHaspopup="menu"
              />
            );
          }

          return (
            <FooterNavItem
              key={item.id}
              label={item.label}
              href={item.href}
              icon={item.icon}
              isActive={isActive(item.href)}
              isMain={item.isMain}
            />
          );
        })}
      </nav>
    </div>
  );
}
