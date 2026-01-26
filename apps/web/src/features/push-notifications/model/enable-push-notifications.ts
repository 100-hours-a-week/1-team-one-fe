import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

import { PutFcmTokenRequest } from '../api/put-fcm-token-mutation';
import { resolvePushRoute } from '../lib/resolve-push-route';
import type { PushNotificationData } from './types';

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
});

let isForegroundListenerBound = false;

function bindForegroundNotifications(messaging: ReturnType<typeof getMessaging>) {
  if (isForegroundListenerBound) return;
  isForegroundListenerBound = true;
  onMessage(messaging, (payload) => {
    const notification = payload?.notification ?? {};
    const data = normalizePushData(payload?.data);
    const route = resolvePushRoute(data.type, data);
    const title = notification.title ?? '알림';
    const options: NotificationOptions = {
      body: notification.body ?? '',
      icon: notification.icon ?? '/icons/icon-192.png',
      data,
    };
    const toast = new Notification(title, options);
    toast.onclick = () => {
      window.focus();
      window.location.assign(route);
      toast.close();
    };
  });
}

export async function enablePushNotifications(
  putFcm: (payload: PutFcmTokenRequest) => Promise<void>,
) {
  if (!('serviceWorker' in navigator)) return;

  let swReg: ServiceWorkerRegistration;
  try {
    swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    await navigator.serviceWorker.ready;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[push-notifications] service_worker_register_failed', { error });
    }
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return;

  const messaging = getMessaging(app);
  bindForegroundNotifications(messaging);
  const fcmToken = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
    serviceWorkerRegistration: swReg,
  });

  if (!fcmToken) return;

  await putFcm({ fcmToken });
}

function normalizePushData(raw: Record<string, string> | undefined): PushNotificationData {
  if (!raw) return {};
  return {
    type: raw.type,
    sessionId: raw.sessionId,
    routineId: raw.routineId,
    jobId: raw.jobId,
    submissionId: raw.submissionId,
    reason: raw.reason,
  };
}
