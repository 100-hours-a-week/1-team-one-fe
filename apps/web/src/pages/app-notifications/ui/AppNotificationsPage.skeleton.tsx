import { NotificationListSkeleton } from '@/src/features/notifications/ui/NotificationList.skeleton';

export function AppNotificationsPageSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-6">
        <NotificationListSkeleton />
      </div>
    </div>
  );
}
