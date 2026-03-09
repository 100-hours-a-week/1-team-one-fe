import { NOTIFICATIONS_MESSAGES } from '@/src/features/notifications/config/messages';
import { ScrollTopButton } from '@/src/shared/ui/scroll-top-button';
import { NotificationsListSection } from '@/src/widgets/notifications-list';

export function AppNotificationsPage() {
  return (
    <div className="flex flex-col">
      <NotificationsListSection />
      <ScrollTopButton ariaLabel={NOTIFICATIONS_MESSAGES.ACTIONS.SCROLL_TOP} />
    </div>
  );
}
