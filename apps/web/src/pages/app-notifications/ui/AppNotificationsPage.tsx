import { ChevronUp } from 'lucide-react';

import { NOTIFICATIONS_MESSAGES } from '@/src/features/notifications/config/messages';
import { NotificationsListSection } from '@/src/widgets/notifications-list';

export function AppNotificationsPage() {
  const handleScrollTop = () => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col">
      <NotificationsListSection />
      <button
        type="button"
        aria-label={NOTIFICATIONS_MESSAGES.ACTIONS.SCROLL_TOP}
        onClick={handleScrollTop}
        className="bg-brand-600 text-on-brand fixed right-4 bottom-6 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition active:scale-95"
      >
        <ChevronUp className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
