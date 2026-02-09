import { useCallback, useEffect, useState } from 'react';

import { usePutFcmTokenMutation } from '../api/put-fcm-token-mutation';
import { getPushPermissionPlatform } from '../lib/permission-platform';
import { consumePushPermissionPrompt } from '../lib/permission-prompt';
import { enablePushNotifications } from './enable-push-notifications';

type UsePushPermissionSheetOptions = {
  autoOpen?: boolean;
};

export function usePushPermissionSheet(options: UsePushPermissionSheetOptions = {}) {
  const { autoOpen = false } = options;
  const { mutateAsync: putFcmToken, isPending } = usePutFcmTokenMutation();
  const [open, setOpen] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [platform, setPlatform] = useState(getPushPermissionPlatform());

  useEffect(() => {
    if (typeof Notification === 'undefined') {
      return;
    }

    setPermission(Notification.permission);
    setPlatform(getPushPermissionPlatform());
  }, []);

  const openSheet = useCallback(() => {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'granted') return;

    setPermission(Notification.permission);
    setPlatform(getPushPermissionPlatform());
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!autoOpen) return;
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'granted') return;
    if (!consumePushPermissionPrompt()) return;

    openSheet();
  }, [autoOpen, openSheet]);

  const requestPermission = useCallback(async () => {
    try {
      await enablePushNotifications(putFcmToken);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[push-notifications] permission_request_failed', { error });
      }
    }

    if (typeof Notification === 'undefined') return;

    setPermission(Notification.permission);
    setPlatform(getPushPermissionPlatform());

    if (Notification.permission !== 'granted') return;

    setOpen(false);
  }, [putFcmToken]);

  return {
    open,
    setOpen,
    permission,
    platform,
    isRequesting: isPending,
    openSheet,
    requestPermission,
  };
}
