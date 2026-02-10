import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

import { PutFcmTokenRequest } from '../api/put-fcm-token-mutation';
import { markPushPermissionPromptNeeded } from '../lib/permission-prompt';
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
    console.debug('[push-notifications] raw_payload', payload);

    const data = normalizePushData(payload?.data);
    const route = resolvePushRoute(data.type, data);

    console.debug('[push-notifications] foreground_message', {
      userId: data.userId,
      type: data.type,
      data,
    });

    const title = '운동할 시간이에요';
    const options: NotificationOptions = {
      body: '오늘 루틴을 시작해볼까요?',
      icon: '/icons/logo-192.png',
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

//최초등록 시 푸시알람 활성화
export async function enablePushNotifications(
  putFcm: (payload: PutFcmTokenRequest) => Promise<void>,
) {
  if (!('serviceWorker' in navigator)) return;
  if (typeof Notification === 'undefined') return;

  const swReg = await registerServiceWorker();
  if (!swReg) return;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return;

  await registerFcmToken(swReg, putFcm);
}

function normalizePushData(raw: Record<string, string> | undefined): PushNotificationData {
  if (!raw) return {};
  return {
    type: raw.type,
    userId: raw.userId,
    sessionId: raw.sessionId,
    routineId: raw.routineId,
    jobId: raw.jobId,
    submissionId: raw.submissionId,
    reason: raw.reason,
  };
}

//로그인 직후 권한 미허용이면 바텀시트로 재요청을 유도
//TODO: 로그 정리
export async function refreshPushTokenOnLogin(
  putFcm: (payload: PutFcmTokenRequest) => Promise<void>,
) {
  if (!('serviceWorker' in navigator)) {
    console.log('[push-notifications] service_worker_not_supported');
    return;
  }
  if (typeof Notification === 'undefined') {
    console.log('[push-notifications] notification_not_supported');
    return;
  }
  if (Notification.permission !== 'granted') {
    markPushPermissionPromptNeeded();
    console.log(Notification.permission);
    console.log('[push-notifications] notification_permission_not_granted');
    return;
  }
  const swReg = await registerServiceWorker();
  if (!swReg) {
    console.log('[push-notifications] service_worker_registration_failed');
    return;
  }

  await registerFcmToken(swReg, putFcm);
}

//fcm 토큰 발급에 필요한 Service Worker 등록
async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  try {
    const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    await navigator.serviceWorker.ready;
    return swReg;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[push-notifications] service_worker_register_failed', { error });
    }
    return null;
  }
}

async function registerFcmToken(
  swReg: ServiceWorkerRegistration,
  putFcm: (payload: PutFcmTokenRequest) => Promise<void>,
) {
  const messaging = getMessaging(app);
  bindForegroundNotifications(messaging);
  const fcmToken = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
    serviceWorkerRegistration: swReg,
  });

  if (!fcmToken) return;

  await putFcm({ fcmToken });
}
